
export enum Env {
  development = 'development',
  production = 'production'
}

import { Dialect } from 'sequelize/types';
import * as yup from 'yup';
import { logger } from '../lib/logger';

export type API_CONFIG = {
  /** NODE_ENV to run the API in */
  env: Env;
  /** Port to run the server on */
  port: number,
  /** Root directory the API is running in */
  rootDir: string,
  /** Mock the API from the schema (Disables resolvers) */
  mocks: boolean;

  /** Directory to load the resolvers from */
  resolverDir: string;
  /** Directory to load the mocks from */
  mocksDir: string;

  /** Database connection details */
  dbConnection: {
    dialect: Dialect;
    database: string
    username: string
    password: string
    host: string
    port: number
  };
  /** Disable a database connection */
  skipDatabase?: boolean;

  /** JWT secret to encrypt all tokens with */
  accessTokenSecret: string,

  /** What sites/hosts can access the API */
  corsAllowFrom: boolean | string | RegExp | (string | RegExp)[]
};



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


export const validateAPI = yup.object().shape({
  env: yup.string().required(),
  port: yup.number().required(),
  rootDir: yup.string(),
  skipDatabase: yup.boolean(),
  mocks: yup.boolean(),

  resolverDir: yup.string(),

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
