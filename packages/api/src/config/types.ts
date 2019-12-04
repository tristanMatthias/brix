import { Dialect } from 'sequelize/types';
import * as yup from 'yup';

export type API_CONFIG = {
  env: Env;
  port: number,

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


export const validateAPI = yup.object({
  env: yup.string().required(),
  port: yup.number().required(),

  resolverDir: yup.string(),

  dbConnection: yup.object({
    database: yup.string().required(),
    username: yup.string().required(),
    password: yup.string(),
    host: yup.string().required(),
    port: yup.number().required()
  }),

  accessTokenSecret: yup.string().required(),

  corsAllowFrom: yup.mixed()
});
