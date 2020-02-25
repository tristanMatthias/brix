import 'reflect-metadata';

import { Config } from '@brix/core';
import { addMockFunctionsToSchema, ApolloServer, IMocks } from 'apollo-server-express';
import { Express } from 'express';
import { GraphQLSchema } from 'graphql';
import { Server } from 'http';

import { createContext as context } from '../lib/context';
import { loadMocks } from '../lib/mocks';


export interface SubscriptionOptions { token: string; }


/**
 * Loads the schema, and applies Apollo middleware to the express app. Adds
 * subscription handlers to the HTTP server as well.
 * @param app Express application
 * @param server HTTP Server
 */
export const apollo = async (
  app: Express,
  server: Server,
  schema: GraphQLSchema
) => {

  let mocks: IMocks | boolean = false;

  if (Config.mocks) {
    addMockFunctionsToSchema({ schema });
    mocks = loadMocks(schema);
  }


  const apolloServer = new ApolloServer({
    schema,
    context,
    mocks

    // subscriptions: {
    //   onConnect: async (connectionParams, _websocket, context) => {
    //     const token = (connectionParams as SubscriptionOptions).token;
    //     if (token) {
    //       try {
    //         await setContextFromToken(
    //           token,
    //           context as unknown as SubscriptionContext
    //         );
    //         return context;
    //       } catch (e) {
    //         throw new ErrorAuthInvalidToken();
    //       }
    //     }

    //     throw new ErrorAuthUnauthenticated();
    //   }
    // }
  });

  apolloServer.applyMiddleware({
    app, cors: {
      origin: Config.corsAllowFrom,
      credentials: true,
      optionsSuccessStatus: 200
    }
  });

  apolloServer.installSubscriptionHandlers(server);

};
