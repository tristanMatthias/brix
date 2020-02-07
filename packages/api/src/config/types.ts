
/**
 * Brix server environment.
 * @default development
 */
export enum Env {
  development = 'development',
  production = 'production'
}

import { Dialect } from 'sequelize/types';
import * as yup from 'yup';
import { logger } from '../lib/logger';
import { RequestHandler, Router } from 'express';

/**
 * Configuration for Brix API instance. This config can be passed directly
 * into the server.
 *
 * @example
 * const server = new API.server({
 *   skipDatabase: true,
 *   resolverDir: './resolvers'
 * })
 *
 * Each setting will be ovreloaded by a `brix.yml`, `.brixrc`, etc, file.
 * Additionally, each setting can be overridden with an environment variable.
 */
export type ApiConfig = {
  /** NODE_ENV to run the API in */
  env: Env;
  /** Port to run the server on */
  port: number,
  /** Root directory the API is running in */
  rootDir: string,
  /** Mock the API from the schema (Disables resolvers) */
  mocks: boolean;

  /** Directory to load the resolvers from */
  resolverDir?: string;
  /** Directory to load the mocks from */
  mocksDir?: string;
  /** Directory to load the middleware from */
  middlewareDir?: string;

  /** Database connection details */
  dbConnection: {
    /** Type of database to connect to */
    dialect: Dialect;
    /** Database nam */
    database: string
    /** Database user */
    username: string
    /** Database password */
    password: string
    /** Database host/url */
    host: string
    /** Port to connect to */
    port: number
  };
  /** Disable a database connection */
  skipDatabase?: boolean;

  /** JWT secret to encrypt all tokens with */
  accessTokenSecret: string,

  /** Which sites/hosts can access the API */
  corsAllowFrom: boolean | string | RegExp | (string | RegExp)[];

  /** Load Express Routers/Middleware into the server */
  middleware: RequestHandler | Router | (RequestHandler | Router)[]
};


/**
 * Ensure that a Yup object doesn't have extra properties
 * @param valid Valid properties allowed for the object
 * @param prefix String to prefix the keys with
 */
const validateProps = (valid: string[], prefix?: string): yup.TestOptions => ({
  name: 'ExtraProps',
  test: v => {
    for (const p of Object.keys(v)) {
      const prop = prefix ? `${prefix}.${p}` : p;
      if (!valid.includes(p)) logger.warn(`Invalid option ${prop}`);
    }
    return true;
  }
});


/**
 * Validates an `ApiConfig` object against the valid schema
 */
export const validateConfig = yup.object().shape({
  env: yup.string().required(),
  port: yup.number().required(),
  rootDir: yup.string(),
  skipDatabase: yup.boolean(),
  mocks: yup.boolean(),

  resolverDir: yup.string(),
  mocksDir: yup.string(),
  middlewareDir: yup.string(),

  dbConnection: yup.object({
    database: yup.string().when('skipDatabase', { is: false, then: yup.string().required() }),
    username: yup.string().when('skipDatabase', { is: false, then: yup.string().required() }),
    dialect: yup.string(),
    password: yup.string(),
    host: yup.string().when('skipDatabase', { is: false, then: yup.string().required() }),
    port: yup.number().when('skipDatabase', { is: false, then: yup.number().required() })
  })
    .test(validateProps([
      'database',
      'username',
      'dialect',
      'password',
      'host',
      'port'
    ], 'dbConnection')),

  accessTokenSecret: yup.string().required(),

  corsAllowFrom: yup.mixed()

}).test(validateProps([
  'env',
  'port',
  'mocks',
  'rootDir',
  'resolverDir',
  'dbConnection',
  'skipDatabase',
  'accessTokenSecret',
  'corsAllowFrom'
]));
