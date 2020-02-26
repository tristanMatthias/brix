import { BrixContext, BrixPlugins } from '@brix/core';
import { ContextFunction } from 'apollo-server-core';

import { fingerprint } from './fingerprint';


export interface SubscriptionContext extends BrixContext { }


/**
 * Setup the context for each request. If it's a subscription (websocket connection)
 * return the connection context.
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

  return context;
};
