import { BrixPlugins } from '@brix/core';
import { ModelBuilder } from '@brix/model';
import { ElasticStore } from './Elastic.store';

export default () => {
  ModelBuilder.registerStore(new ElasticStore());
  BrixPlugins.register({
    name: 'Store - Elastic Search',
    description: 'Enables Elastic Search as the store for Brix projects'
  });
};
