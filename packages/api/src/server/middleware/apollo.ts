import 'reflect-metadata';

import { addMockFunctionsToSchema, ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { Server } from 'http';

import { CONFIG } from '../../config';
import { ErrorAuthInvalidToken, ErrorAuthUnauthenticated } from '../../errors';
import { createContext as context, setContextFromToken, SubscriptionContext } from '../../lib/context';
import { buildSchema, loadMocks } from '../../lib/schema';


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

  const _schema = await buildSchema();

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
