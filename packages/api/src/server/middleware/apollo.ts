import 'reflect-metadata';

import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { Server } from 'http';
import path from 'path';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';

import { CONFIG } from '../../config';
import { ErrorAuthInvalidToken, ErrorAuthUnauthenticated } from '../../errors';
import { authChecker } from '../../lib/auth';
import { createContext as context, setContextFromToken, SubscriptionContext } from '../../lib/context';

const defaultResolver = '../../lib/defaultResolver';

const loadResolvers = (dir?: string): BuildSchemaOptions['resolvers'] => {
  let resolvers;

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


export const apollo = async (
  app: Express,
  server: Server
) => {

  const apolloServer = new ApolloServer({
    schema: await schema(),
    context,

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
