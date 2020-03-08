import { BrixPlugins } from '@brix/core';

import { AdminResolver } from './Admin.resolver';
import { serveStatic } from './middleware/serveStatic';

export * from './Admin';
export * from './widgets/Widget.union';
export * from './widgets/fields/FormField.union';

export interface PluginAdminOptions {
  prefix: string;
}

const defaultOptions: PluginAdminOptions = {
  prefix: '/admin'
};

export default (options: Partial<PluginAdminOptions> = {}) => {
  const settings = { ...defaultOptions, options };
  BrixPlugins.register({
    name: 'Brix Admin',
    requires: [
      '@brix/plugin-entity-user',
      '@brix/plugin-auth-jwt'
    ],
    middlewares: [serveStatic(settings.prefix)],
    resolvers: [AdminResolver]
  });
};
