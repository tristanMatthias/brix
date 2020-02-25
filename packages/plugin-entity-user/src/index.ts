import { BrixPlugins } from '@brix/core';

import { UserResolver } from './entities/User.entity';

export * from './entities/User.entity';

export default () => {
  BrixPlugins.register({
    name: 'User Entity',
    description: 'Defines a common user entity for Brix',
    resolvers: [UserResolver]
  });
};
