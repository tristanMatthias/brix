import 'reflect-metadata';

import { Config, logger } from '@brix/core';
import { IMocks } from 'apollo-server-express';
import { GraphQLSchema } from 'graphql';
import path from 'path';


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
      load(dir || path.resolve(Config.distDir, 'gql/mocks'));
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
