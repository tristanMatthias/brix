import { BrixPlugins } from '@brix/core';

import { User } from './entities/User.entity';
export * from './entities/User.entity';

export default () => {
  BrixPlugins.register({
    name: 'User Entity',
    description: 'Defines a common user entity for Brix',
    entities: [User],
    scalars: []
  });
};
