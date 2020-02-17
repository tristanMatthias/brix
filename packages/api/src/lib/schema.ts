import 'reflect-metadata';

import { IMocks } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import path from 'path';
import { buildSchema as buildSchemaGQL, BuildSchemaOptions } from 'type-graphql';

import { authChecker } from '../lib/auth';
import { BrixPlugins, dirOrDist, logger, Config } from '@brix/core';

/**
 * Load the resolvers for the schema, and default to gql/resolvers/index.js
 * @param dir Directory to load resolvers from
 */
export const loadResolvers = (dir?: string): BuildSchemaOptions['resolvers'] => {
  let resolvers;
  const defaultResolver = '../lib/defaultResolver';

  const load = (dir: string) => {
    let pkg;
    try {
      pkg = require(dirOrDist(dir));
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') logger.error(e);
      throw e;
    }

    if (pkg.resolvers) resolvers = pkg.resolvers;
    else resolvers = pkg.default;
  };

  if (Config.resolverDir) {
    load(Config.resolverDir);
  } else {
    try {
      const dd = dirOrDist(dir || Config.rootDir);
      load(path.resolve(dd, 'gql/resolvers'));
    } catch (e) {
      if (e.code && e.code === 'MODULE_NOT_FOUND') resolvers = [require(defaultResolver)];
      else throw e;
    }
  }
  return resolvers || [require(defaultResolver)];
};


const defaultMocks = {
  DateTime: () => new Date(+(new Date()) - Math.floor(Math.random() * 10000000000))
};


/**
 * Load mock generators for the types in the supplied schema.
 * @param schema Schema object for looking up types
 * @param dir Directory to load the mocks from
 */
export const loadMocks = (schema: GraphQLSchema, dir?: string): IMocks | boolean => {
  let mocks: IMocks | Boolean = true;

  const load = (dir: string) => {
    const pkg = require(dir);
    if (pkg.mocks) mocks = pkg.mocks;
    else mocks = pkg.default;
  };

  if (Config.mocksDir) {
    load(Config.mocksDir);
  } else {
    try {
      load(dir || path.resolve(Config.rootDir, 'gql/mocks'));
    } catch (e) {
      if (e.code && e.code === 'MODULE_NOT_FOUND') mocks = true;
      else throw e;
    }
  }

  if (typeof mocks === 'object') {
    Object.keys(mocks).forEach(k => {
      if (!schema.getType(k)) logger.warn(`Invalid mock entity '${k}'. Schema does not contain this type`);
    });
  }

  if (mocks === true) return defaultMocks;
  return { ...defaultMocks, ...mocks! };
};


let schema: GraphQLSchema;
/**
 * Generate a GQL schema from resolvers, and loads them if not supplied
 * @param resolvers Object of GQL resolvers. Will load default if none passed
 */
export const buildSchema = async (resolvers?: BuildSchemaOptions['resolvers'] | string) => {
  if (schema) return schema;
  const r = (typeof resolvers === 'string' || !resolvers) ? loadResolvers(resolvers) : resolvers;

  await BrixPlugins.build();

  return schema = await buildSchemaGQL({
    dateScalarMode: 'isoDate',
    validate: false,
    resolvers: [...r, ...BrixPlugins.resolvers],
    authChecker
  });
};
