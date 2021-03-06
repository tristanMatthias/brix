import deepmerge from 'deepmerge';
import { config } from 'dotenv';
import findup from 'find-up';
import fs from 'fs-extra';
import path from 'path';
import yaml from 'yaml';

import { ErrorInvalidConfigOption, ErrorInvalidEnvironment, ErrorNoConfigFileFound } from '../errors';
import { dirOrDist } from '../lib/dirOrDist';
import { CONFIG_BASE, CONFIG_DEVELOPMENT, CONFIG_PRODUCTION, CONFIG_TEST, CONFIGS } from './defaults';
import { BrixConfig, Env } from './types';
import { validateConfig } from './validate';
import { setupLogger, logger } from '../lib';


// Allow for `.env` files to override config
const dotEnv = () => config({
  path: process.env.ENV || path.resolve(process.cwd(), '.env')
});
dotEnv();


export abstract class Config {
  static env: BrixConfig['env'];
  static port: BrixConfig['port'];
  static rootDir: BrixConfig['rootDir'];
  static distDir: BrixConfig['distDir'];
  static mocks: BrixConfig['mocks'];
  static resolverDir: BrixConfig['resolverDir'];
  static mocksDir: BrixConfig['mocksDir'];
  static middlewareDir: BrixConfig['middlewareDir'];
  static generatedDir: BrixConfig['generatedDir'];
  static dbConnection: BrixConfig['dbConnection'];
  static skipDatabase: BrixConfig['skipDatabase'];
  static accessTokenSecret: BrixConfig['accessTokenSecret'];
  static corsAllowFrom: BrixConfig['corsAllowFrom'];
  static middleware: BrixConfig['middleware'];
  static plugins: BrixConfig['plugins'];
  static clsNamespace: BrixConfig['clsNamespace'];
  static logLevel: BrixConfig['logLevel'];
  static installPlugins: BrixConfig['installPlugins'];
  static bodySizeLimit: BrixConfig['bodySizeLimit'];
  static depthLimit: BrixConfig['depthLimit'];

  private static loaded?: Partial<BrixConfig>;

  static reset() {
    this.loaded = undefined;
    return Object.assign(this, {
      ...CONFIG_BASE,
      plugins: {},
      middleware: []
    });
  }

  static loadEnv(env: Env | 'development' | 'test' | 'production') {
    switch (env) {
      case 'development':
      case Env.development:
        setupLogger(Env.development, CONFIG_DEVELOPMENT.logLevel);
        return Object.assign(this, CONFIG_DEVELOPMENT);
      case 'test':
      case Env.test:
        setupLogger(Env.test, CONFIG_TEST.logLevel);
        return Object.assign(this, CONFIG_TEST);
      case 'production':
      case Env.production:
        setupLogger(Env.production, CONFIG_PRODUCTION.logLevel);
        return Object.assign(this, CONFIG_PRODUCTION);
    }
  }


  /**
   * Load a Brix configuration file. Brix will attempt to load it from the root
   * project directory, and look for `brix.yml`, `brix.yaml`, `brix.json` and `.brixrc`
   * files.
   * @param dir Directory to load the config file from
   */
  static async loadConfig(dir: string = Config.rootDir!) {
    await setupLogger();
    let config: Partial<BrixConfig> = {};

    if (this.loaded && (!dir || dir === Config.rootDir)) config = this.loaded;
    else {
      if (dir && dir !== Config.rootDir) {
        await this.update({
          rootDir: dir,
          distDir: dirOrDist(dir)
        });
      }

      let yml;
      let json;


      const find = (p: string[] | string) => findup(p, { cwd: dir });

      const fYaml = await find(['brix.yml', 'brix.yaml']);
      const fJson = await find(['brix.json', '.brixrc']);

      if (!fYaml && !fJson) throw new ErrorNoConfigFileFound(dir);

      if (fYaml) yml = await fs.readFile(fYaml);
      else if (fJson) json = await fs.readFile(fJson);


      if (yml) config = yaml.parse(yml.toString());
      else if (json) config = JSON.parse(json.toString());

      this.loaded = config;
    }

    this.hydrateEnv(config);

    if (config && Object.keys(config).length) await this.update(config);
    return this.toJSON();
  }


  static hydrateEnv(config: any) {
    if (!config) return;
    if (config instanceof Array) config.forEach(this.hydrateEnv);
    else if (typeof config === 'object') {
      Object.entries(config).forEach(([k, v]) => {
        if (typeof v === 'string') {
          if (v.startsWith('$')) {
            const env = v.slice(1);
            if (process.env[env] !== undefined) config[k] = process.env[env];
            else logger.warning(`[CONFIG] Tried to use the ${env} variable, but it was not set`);
          }
        } else this.hydrateEnv(config[k]);
      });
    }
  }


  /**
   * Override particular settings globally (uss deep merging)
   * @param config Override settings for the config
   */
  static async update(config: Partial<BrixConfig> | Env) {
    dotEnv();

    let newConfig: Partial<BrixConfig>;

    if (typeof config === 'string') {
      newConfig = CONFIGS[config];
      if (!newConfig) throw new ErrorInvalidEnvironment(config);
    } else newConfig = config || {};

    try {
      newConfig = this.merge(newConfig);
      await validateConfig.validate(newConfig, { strict: true });
      Object.assign(this, newConfig);
    } catch (e) {
      throw new ErrorInvalidConfigOption(e.message);
    }

    if (newConfig.rootDir) Object.assign(this, { distDir: dirOrDist(newConfig.rootDir) });
  }

  private static toJSON(): BrixConfig {
    return {
      env: this.env,
      port: this.port,
      rootDir: this.rootDir,
      distDir: this.distDir,
      mocks: this.mocks,
      resolverDir: this.resolverDir,
      mocksDir: this.mocksDir,
      generatedDir: this.generatedDir,
      middlewareDir: this.middlewareDir,
      dbConnection: this.dbConnection,
      skipDatabase: this.skipDatabase,
      accessTokenSecret: this.accessTokenSecret,
      corsAllowFrom: this.corsAllowFrom,
      middleware: this.middleware,
      plugins: this.plugins,
      clsNamespace: this.clsNamespace,
      logLevel: this.logLevel,
      installPlugins: this.installPlugins,
      bodySizeLimit: this.bodySizeLimit,
      depthLimit: this.depthLimit
    };
  }

  private static merge(config: Partial<BrixConfig>): Partial<BrixConfig> {
    // TODO: Hydrate `$ENV.value` from process.env
    return deepmerge.all([
      CONFIGS[config.env || process.env.NODE_ENV as Env || 'development'] || CONFIG_BASE,
      this.toJSON(),
      config
    ]);
  }
}


// Intialize with base config
Config.reset();
