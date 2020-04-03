import { BrixPlugins } from '@brix/core';

import { authChecker } from './authChecker';
import { addJWTToContext } from './lib/context';
import { VerifyTokenResolver } from './VerifyToken.resolver';


export * from './authChecker';
export * from './lib/context';

export default () => {
  BrixPlugins.register({
    name: 'Auth - JWT',
    description: 'JWT verification in Brix',
    contextMiddlewares: [addJWTToContext],
    authCheckers: [authChecker],
    resolvers: [VerifyTokenResolver]
  });
};
