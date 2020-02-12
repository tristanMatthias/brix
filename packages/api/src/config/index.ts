import deepmerge from 'deepmerge';
import { config } from 'dotenv';
import path from 'path';

import { logger } from '../lib/logger';
import { CONFIG_DEVELOPMENT } from './development';
import { CONFIG_PRODUCTION } from './production';
import { CONFIG_TEST } from './test';
import { ApiConfig, Env, validateConfig } from './types';


const CONFIGS: { [env in Env]: ApiConfig } = {
  development: CONFIG_DEVELOPMENT,
  test: CONFIG_TEST,
  production: CONFIG_PRODUCTION
};

// Allow for `.env` files to override config
const dotEnv = () => config({ path: path.resolve(process.cwd(), '.env') });
dotEnv();


// @ts-ignore Allow for initial empty config
export let CONFIG: ApiConfig = {};


/**
 * Merge and update configuration options for the global `CONFIG`
 * @param config Partial `ApiConfig` to merge with existing config
 */
export const updateConfig = async (config: Partial<ApiConfig> | Env) => {
  dotEnv();

  try {
    let newConfig;

    if (typeof config === 'string') {
      newConfig = CONFIGS[config];
    } else newConfig = config || {};

    newConfig = deepmerge.all([
      CONFIGS[newConfig.env || process.env.NODE_ENV as Env || 'development'],
      CONFIG,
      newConfig
    ]);

    await validateConfig.validate(newConfig, { strict: true });
    CONFIG = newConfig as ApiConfig;

  } catch (e) {
    logger.error(`${e.message} in CONFIG`);
    throw new Error(`${e.message} in CONFIG`);
  }
};
