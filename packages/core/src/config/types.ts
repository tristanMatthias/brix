import { RequestHandler, Router } from 'express';

export type DBDialect = 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'mariadb';

/**
 * Brix server environment.
 * @default development
 */
export enum Env {
  development = 'development',
  test = 'test',
  production = 'production'
}

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
export interface BrixConfig {
  /** NODE_ENV to run the API in */
  env: Env;
  /** Port to run the server on */
  port: number;
  /** Root directory the API is running in */
  rootDir: string;
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
    dialect: DBDialect;
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
  accessTokenSecret: string;

  /** Which sites/hosts can access the API */
  corsAllowFrom: boolean | string | RegExp | (string | RegExp)[];

  /** Load Express Routers/Middleware into the server */
  middleware: RequestHandler | Router | (RequestHandler | Router)[];

  // /** Load Apollo Context middleware into the server */
  // contextMiddleware: BrixContextMiddleware[];

  plugins: BrixConfigPlugin[];

  /** Namespace for the CLS */
  clsNamespace: string;
}

export interface BrixConfigPlugin {
  name: string;
  options: {
    [setting: string]: any
  };
}

/** Brix context to use in Apollo */
export interface BrixContext {
  /** Unique fingerprint for the request */
  fingerprint: string;
  /** User object decoded from JWT */
  user?: BrixContextUser;
  /** JWT is validated */
  valid: boolean;
  /** JWT retrieved from the `Authorization` header */
  accessToken: string | null;
  /** Role associated to the user */
  role?: string;
}

export interface BrixContextUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
