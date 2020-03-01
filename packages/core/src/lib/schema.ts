import 'reflect-metadata';

import { graphql, GraphQLSchema } from 'graphql';
import { generateTypeScriptTypes } from 'graphql-schema-typescript';
import path from 'path';
import { buildSchema as buildSchemaGQL, BuildSchemaOptions, emitSchemaDefinitionFile } from 'type-graphql';

import { Config } from '../config';
import { ErrorGQLNoResolvers, ErrorGQLGenerateSchemaError } from '../errors';
import { BrixPlugins } from '../plugins';
import { dirOrDist, logger } from './';
import { getHash } from './hash';
import { introspectionQuery } from './introspectionQuery';

/**
 * Load the resolvers for the schema, and default to gql/resolvers/index.js
 * @param dir Directory to load resolvers from
 */
export const loadResolvers = (dir?: string): BuildSchemaOptions['resolvers'] => {
  let resolvers: BuildSchemaOptions['resolvers'] = [];


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
      if (e.code !== 'MODULE_NOT_FOUND') throw e;
    }
  }
  return resolvers;
};


let schema: GraphQLSchema;
/**
 * Generate a GQL schema from resolvers, and loads them if not supplied
 * @param resolvers Object of GQL resolvers. Will load default if none passed
 */
export const buildSchema = async (
  resolvers?: BuildSchemaOptions['resolvers'] | string,
  authChecker: BuildSchemaOptions['authChecker'] = () => { return true; },
  useCache = true
) => {
  if (schema && useCache) return schema;
  await Config.loadConfig();
  const r = (typeof resolvers === 'string' || !resolvers) ? loadResolvers(resolvers) : resolvers;

  const { resolvers: pluginResolvers } = await BrixPlugins.build();
  const _resolvers = [...r ?? [], ...pluginResolvers];

  if (!_resolvers.length) throw new ErrorGQLNoResolvers();

  try {
    schema = await buildSchemaGQL({
      dateScalarMode: 'isoDate',
      validate: false,
      resolvers: _resolvers,
      authChecker
    });
  } catch (e) {
    if (e.constructor.name === 'GeneratingSchemaError') {
      throw new ErrorGQLGenerateSchemaError(e.details);
    }
    throw e;
  }

  return schema;
};


let prevSchema: string;
export const schemaToJSON = async () => {
  const schema = await buildSchema(undefined, undefined, false);
  const json = await graphql(schema, introspectionQuery);
  const newSchema = getHash(JSON.stringify(json));
  const changed = newSchema !== prevSchema;
  prevSchema = newSchema;
  return { schema, changed };
};


/**
 * Generates a schema.gql file based on a Graph API schema
 * your API types/queries/etc for a front end application
 * @param dir Directory to load the schema gql file from
 */
export const generateSchema = async (dir?: string, out?: string) => {
  await emitSchemaDefinitionFile(
    path.resolve(out || dirOrDist(Config.rootDir), 'schema.gql'),
    await buildSchema(dir)
  );
};


/**
 * Generate a schema definition file (.d.ts) from a schema.gql file.
 * Useful for exporting your API types/queries/etc for a front end application.
 * @param schema Schema file to load
 * @param out Definition file to write (.d.ts)
 */
export const generateTypes = async (schema?: string, out?: string) => {
  await generateTypeScriptTypes(schema || 'dist/schema.gql', out || 'dist/schema.d.ts', {
    typePrefix: ''
  });
};
