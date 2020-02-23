import path from 'path';
import shortid from 'shortid';

import { dirOrDist } from '../lib/dirOrDist';
import { BrixConfig, DBDialect, Env } from './types';

export const CONFIG_BASE: Partial<BrixConfig> = {
  env: process.env.NODE_ENV as Env || Env.production,
  port: parseInt(process.env.PORT!) || 4000,
  rootDir: dirOrDist(process.mainModule
    ? path.dirname(process.mainModule!.filename)
    : process.cwd()
  ),
  mocks: Boolean(process.env.MOCKS) || false,
  skipDatabase: Boolean(process.env.SKIP_DB),
  dbConnection: {
    dialect: process.env.DB_DIALECT as DBDialect || 'sqlite',
    database: process.env.DB_DATABASE!,
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
  },
  accessTokenSecret: process.env.JWT_SECRET || shortid(),
  clsNamespace: 'brix-namespace'
};


export const CONFIG_DEVELOPMENT: Partial<BrixConfig> = {
  ...CONFIG_BASE,
  env: Env.development,
  corsAllowFrom: /.*/,
  dbConnection: {
    dialect: 'sqlite',
    database: process.env.DB_DATABASE || 'brix',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
  },
  accessTokenSecret: 'dev-secret'
};

export const CONFIG_TEST: Partial<BrixConfig> = {
  ...CONFIG_DEVELOPMENT as BrixConfig,
  env: Env.test
};


export const CONFIG_PRODUCTION: Partial<BrixConfig> = {
  ...CONFIG_BASE,
  env: Env.production,
  corsAllowFrom: true
};


export const CONFIGS: { [env in Env]: Partial<BrixConfig> } = {
  development: CONFIG_DEVELOPMENT,
  test: CONFIG_TEST,
  production: CONFIG_PRODUCTION
};
