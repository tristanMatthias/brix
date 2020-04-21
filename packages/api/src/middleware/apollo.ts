import 'reflect-metadata';

import { Config } from '@brix/core';
import { addMockFunctionsToSchema, ApolloServer, IMocks } from 'apollo-server-express';
import { Express } from 'express';
import { GraphQLSchema } from 'graphql';
import { Server } from 'http';

import { createContext as context } from '../lib/context';
import { loadMocks } from '../lib/mocks';
import strip from 'strip-ansi';
import depthLimit from 'graphql-depth-limit';


export interface SubscriptionOptions { token: string; }


class BrixApolloServer extends ApolloServer {
  async createGraphQLServerOptions(req: any, res: any) {
    const options = await super.createGraphQLServerOptions(req, res);

    const settings: any = {
      ...options,
      validationRules: []
    };

    if (Config.depthLimit !== undefined) {
      settings.validationRules.push(
        depthLimit(Config.depthLimit)
      );
    }

    return settings;
  }
}


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


  const apolloServer = new BrixApolloServer({
    schema,
    context,
    mocks,
    formatError: err => {
      err.message = strip(err.message);
      return err;
    }

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
