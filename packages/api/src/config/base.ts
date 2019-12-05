import { config } from 'dotenv';
import path from 'path';
import { Dialect } from 'sequelize/types';
import shortid from 'shortid';

import { API_CONFIG, Env } from './types';


/*******************************************************************************
 *
 *              ! DO NOT PUT ANYTHING SECURE IN THESE FILES !
 *
 ******************************************************************************/

config({
  path: process.env.ENV || path.resolve(process.cwd(), '.env')
});

export const CONFIG_BASE: Partial<API_CONFIG> = {
  env: process.env.NODE_ENV as Env || Env.production,
  port: parseInt(process.env.PORT!) || 4000,
  rootDir: path.dirname(process.mainModule!.filename),
  skipDatabase: Boolean(process.env.SKIP_DB),
  dbConnection: {
    dialect: process.env.DB_DIALECT as Dialect || 'sqlite',
    database: process.env.DB_DATABASE!,
    username: process.env.DB_USERNAME!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
  },
  accessTokenSecret: process.env.JWT_SECRET || shortid()
};
