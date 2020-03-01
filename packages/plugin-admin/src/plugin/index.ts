import { BrixPlugins } from '@brix/core';

import { AdminResolver } from './Admin.resolver';
import { serveStatic } from './middleware/serveStatic';

export * from './Admin';

export default () => {
  BrixPlugins.register({
    name: 'Brix Admin',
    requires: [
      '@brix/plugin-entity-user',
      '@brix/plugin-auth-jwt'
    ],
    middlewares: [serveStatic],
    resolvers: [AdminResolver]
  });
};
