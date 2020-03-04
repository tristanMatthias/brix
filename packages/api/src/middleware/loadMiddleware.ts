import { BrixConfig, BrixPlugins, Config, logger } from '@brix/core';
import chalk from 'chalk';
import { Express } from 'express';
import fs from 'fs-extra';
import path from 'path';


/**
 * Load middleware from the `Config`, or else from the middleware directory
 * @param app Express application
 */
export const loadMiddleware = async (app: Express) => {

  await Promise.all(
    BrixPlugins.middlewares.map(async mw => {
      const res = await mw(app);
      if (res) app.use(res);
    })
  );

  // Load middleware from what was passed in explicitly
  if (Config.middleware instanceof Array && Config.middleware.length) {
    Config.middleware.forEach(mw => app.use(mw));
  } else if (typeof Config.middleware === 'function') {
    app.use(Config.middleware);

    // Load middleware from the project root
  } else {
    const dir = Config.middlewareDir || path.join(Config.distDir, 'middleware');
    if (await fs.pathExists(dir)) {
      const files = (await fs.readdir(dir)).filter(f =>
        (f.endsWith('.js') || f.endsWith('.ts')) &&
        (!f.endsWith('.d.ts'))
      );

      const mws: BrixConfig['middleware'] = await Promise.all(files.map(async f => {
        const fp = path.join(dir, f);
        const mw = await import(fp);

        if (typeof mw.default !== 'function') {
          logger.error(
            `'${chalk.yellow(fp)}' does not export a default Express router or middleware function`
          );
          return false;
        }

        app.use(mw.default);
        logger.info(`Loaded middleware ${chalk.yellow(f)}`);
        return mw.default;
      }));

      await Config.update({ middleware: mws.filter(mw => mw) });
    }
  }
};
