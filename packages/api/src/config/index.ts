import { config } from 'dotenv';
import path from 'path';

import { logger } from '../lib/logger';
import { CONFIG_DEVELOPMENT } from './development';
import { CONFIG_PRODUCTION } from './production';
import { API_CONFIG, Env, validateAPI } from './types';


const CONFIGS: { [env in Env]: API_CONFIG } = {
  development: CONFIG_DEVELOPMENT,
  production: CONFIG_PRODUCTION
};

export const dotEnv = () => {
  config({
    path: path.resolve(process.cwd(), '.env')
  });
};
dotEnv();


// @ts-ignore
export let CONFIG: API_CONFIG = {};

export const updateConfig = async (config: Partial<API_CONFIG> | Env) => {
  dotEnv();

  try {
    let newConfig;

    if (typeof config === 'string') {
      newConfig = CONFIGS[config];
    } else newConfig = config;

    newConfig = {
      ...CONFIGS[process.env.NODE_ENV as Env || 'development'],
      ...CONFIG,
      ...newConfig
    };

    await validateAPI.validate(newConfig);
    CONFIG = newConfig as API_CONFIG;

  } catch (e) {
    logger.error(`${e.message} in CONFIG`);
    throw new Error(`${e.message} in CONFIG`);
  }
};
