import { BrixContext, BrixPlugins } from '@brix/core';
import { ContextFunction } from 'apollo-server-core';

import { ErrorAuthInvalidAuthorizationHeader } from '../errors';
import { fingerprint } from './fingerprint';


export interface SubscriptionContext extends BrixContext { }


/**
 * Setup the context for each request. If it's a subscription (websocket connection)
 * return the connection context, otherwise retrieve the JWTs from the header.
 * Additionally loads context middleware from plugins
 */
export const createContext: ContextFunction = async ({ req, connection }) => {

  if (!req || !req.headers) return connection.context;

  const context: Partial<BrixContext> = {
    valid: false,
    fingerprint: fingerprint(req)
  };

  // Load context middleware from plugins
  BrixPlugins.contextMiddlewares.forEach(mw => mw(req, context));

  // Attempt to load the access token via the header 'Authorization'
  // in 'Bearer xyz' format
  let accessToken = req.headers.authorization;

  if (accessToken) {
    try {
      [, accessToken] = /^Bearer\s(.+)$/.exec(accessToken)!;
      if (!accessToken.length) throw new ErrorAuthInvalidAuthorizationHeader();
    } catch (e) {
      throw new ErrorAuthInvalidAuthorizationHeader();
    }
  }

  return context;
};
