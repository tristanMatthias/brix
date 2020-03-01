import { Express, Handler, Request } from 'express';
import { GraphQLScalarType } from 'graphql';

import { BrixContext } from '../config/types';


export type MiddlewareFunction = (app: Express) => Handler | void | Promise<Handler | void>;
export type BrixContextMiddleware = (req: Request, context: Partial<BrixContext>) => Partial<BrixContext>;
export type BrixAuthChecker = (context: BrixContext, roles: string[]) => Promise<boolean> | boolean;

/**
 * Options for registering a plugin with Brix
 */
export interface BrixPluginOptions {
  /** Pretty name of the Brix plugin */
  name: string;
  /** Description of the Brix plugin */
  description?: string;
  /** List of other Brix plugins this plugin relies on */
  requires?: string[];
  // /** GQL Entities to register in Brix */
  // entities?: ClassType<any>[];
  /** GQL Scalars to register in Brix */
  scalars?: ScalarsTypeMap[];
  /** GQL Resolvers to register in Brix */
  resolvers?: ClassType<any>[];
  /** Express middlewares to register in Brix */
  middlewares?: MiddlewareFunction[];
  /** Apollo Context middleware to register in Brix */
  contextMiddlewares?: BrixContextMiddleware[];
  /** type-graphql Auth checker to register in Brix */
  authCheckers?: BrixAuthChecker[];
}
export interface BrixPluginSettings extends BrixPluginOptions {
  package: string;
}

export interface BrixPluginData {
  // /** Array of GQL Entities */
  // entities: ClassType<any>[];
  /** Array of GQL Scalars */
  scalars: ScalarsTypeMap[];
  /** Array of GQL Resolvers */
  resolvers: ClassType<any>[];
  /** Array of Express middlewares */
  middlewares: MiddlewareFunction[];
  /** Array of Apollo context middlewares */
  contextMiddlewares: BrixContextMiddleware[];
  /** type-graphql Auth checker to register in Brix */
  authCheckers: BrixAuthChecker[];
}

export type PluginPkg = (options?: any) => any;

/**
 * Setting for `type-graphql` scalars
 * @see https://typegraphql.ml/docs/scalars.html#custom-scalars
 */
export interface ScalarsTypeMap {
  type: Function;
  scalar: GraphQLScalarType;
}

/** Generic Class type */
export interface ClassType<T = any> {
  new(...args: any[]): T;
}
