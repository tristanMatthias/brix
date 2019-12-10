import 'reflect-metadata';

import { addMockFunctionsToSchema, ApolloServer, IMocks } from 'apollo-server-express';
import { Express } from 'express';
import { GraphQLSchema } from 'graphql';
import { Server } from 'http';
import path from 'path';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';

import { CONFIG } from '../../config';
import { ErrorAuthInvalidToken, ErrorAuthUnauthenticated } from '../../errors';
import { authChecker } from '../../lib/auth';
import { createContext as context, setContextFromToken, SubscriptionContext } from '../../lib/context';
import { logger } from '../../lib/logger';


/**
 * Load the resolvers for the schema, and default to gql/resolvers/index.js
 * @param dir Directory to load resolvers from
 */
export const loadResolvers = (dir?: string): BuildSchemaOptions['resolvers'] => {
  let resolvers;
  const defaultResolver = '../../lib/defaultResolver';

  const load = (dir: string) => {
    const pkg = require(dir);
    if (pkg.resolvers) resolvers = pkg.resolvers;
    else resolvers = pkg.default;
  };

  if (CONFIG.resolverDir) {
    load(CONFIG.resolverDir);
  } else {
    try {
      load(dir || path.resolve(CONFIG.rootDir, 'gql/resolvers'));
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
 * Load the resolvers for the schema, and default to gql/resolvers/index.js
 * @param dir Directory to load resolvers from
 */
export const loadMocks = (schema: GraphQLSchema, dir?: string): IMocks | boolean => {
  if (!CONFIG.mocks) return false;
  let mocks: IMocks | Boolean = true;

  const load = (dir: string) => {
    const pkg = require(dir);
    if (pkg.mocks) mocks = pkg.mocks;
    else mocks = pkg.default;
  };

  if (CONFIG.mocksDir) {
    load(CONFIG.mocksDir);
  } else {
    try {
      load(dir || path.resolve(CONFIG.rootDir, 'gql/mocks'));
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


/**
 * Generate a GQL schema from resolvers, and loads them if not supplied
 * @param resolvers Object of GQL resolvers. Will load default if none passed
 */
export const schema = (resolvers?: BuildSchemaOptions['resolvers'] | string) => {
  const r = (typeof resolvers === 'string' || !resolvers) ? loadResolvers(resolvers) : resolvers;

  return buildSchema({
    dateScalarMode: 'isoDate',
    validate: false,
    resolvers: r,
    authChecker
  });
};


export interface SubscriptionOptions { token: string; }


/**
 * Loads the schema, and applies Apollo middleware to the express app. Adds
 * subscription handlers to the HTTP server as well.
 * @param app Express application
 * @param server HTTP Server
 */
export const apollo = async (
  app: Express,
  server: Server
) => {

  const _schema = await schema();

  if (CONFIG.mocks) {
    addMockFunctionsToSchema({
      schema: _schema
    });
  }


  const apolloServer = new ApolloServer({
    schema: _schema,
    context,
    mocks: loadMocks(_schema),
    // mockEntireSchema: false,

    subscriptions: {
      onConnect: async (connectionParams, _websocket, context) => {
        const token = (connectionParams as SubscriptionOptions).token;
        if (token) {
          try {
            await setContextFromToken(
              token,
              context as unknown as SubscriptionContext
            );
            return context;
          } catch (e) {
            throw new ErrorAuthInvalidToken();
          }
        }

        throw new ErrorAuthUnauthenticated();
      }
    }
  });

  apolloServer.applyMiddleware({
    app, cors: {
      origin: CONFIG.corsAllowFrom,
      credentials: true,
      optionsSuccessStatus: 200
    }
  });

  apolloServer.installSubscriptionHandlers(server);

};
