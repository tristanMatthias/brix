import { BrixPlugins } from '@brix/core';
import { ModelBuilder } from '@brix/model';
import { SequelizeStore } from './Sequelize.store';

export default () => {
  ModelBuilder.registerStore(new SequelizeStore());
  BrixPlugins.register({
    name: 'Store - Sequelize',
    description: 'Enables Sequelize as the store for Brix projects'
  });
};
