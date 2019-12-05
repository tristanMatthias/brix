import { Dialect } from 'sequelize/types';
import * as yup from 'yup';

export type API_CONFIG = {
  env: Env;
  port: number,
  rootDir: string,

  resolverDir: string;

  dbConnection: {
    dialect: Dialect;
    database: string
    username: string
    password: string
    host: string
    port: number
  };
  skipDatabase?: boolean;

  accessTokenSecret: string,

  corsAllowFrom: boolean | string | RegExp | (string | RegExp)[]
};

export enum Env {
  development = 'development',
  production = 'production'
}


const validateProps = (valid: string[], prefix?: string): yup.TestOptions => ({
  name: 'ExtraProps',
  test: v => {
    for (const p of Object.keys(v)) {
      const prop = prefix ? `${prefix}.${p}` : p;
      if (!valid.includes(p)) throw new Error(`Invalid option ${prop}`);
    }
    return true;
  }
});


export const validateAPI = yup.object().shape({
  env: yup.string().required(),
  port: yup.number().required(),
  rootDir: yup.string(),
  skipDatabase: yup.boolean(),

  resolverDir: yup.string(),

  dbConnection: yup.object({
    database: yup.string().required(),
    username: yup.string().required(),
    dialect: yup.string(),
    password: yup.string(),
    host: yup.string().required(),
    port: yup.number().required()
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
  'rootDir',
  'resolverDir',
  'dbConnection',
  'skipDatabase',
  'accessTokenSecret',
  'corsAllowFrom'
]));
