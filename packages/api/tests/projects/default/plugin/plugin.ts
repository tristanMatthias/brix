import { BrixPlugins } from '@brix/core';
import { MockResolver } from '../../../mocks/resolvers/Mock.resolver';

export default () => {
  BrixPlugins.register({
    name: 'Test plugin',
    middlewares: [() => (req, res, next) => {
      next();
    }, () => null],
    resolvers: [MockResolver]
  });
};

