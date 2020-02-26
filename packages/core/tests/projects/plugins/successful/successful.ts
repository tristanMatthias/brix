import { BrixPlugins } from '../../../../src';
import { GraphQLScalarType } from 'graphql';

export default () => {
  BrixPlugins.register({
    name: 'successful',
    authCheckers: [() => { return true; }],
    middlewares: [() => { }],
    contextMiddlewares: [(_req, ctx) => ctx],
    resolvers: [class { }],
    scalars: [{
      type: () => { },
      scalar: new GraphQLScalarType({
        name: 'test',
        serialize: () => { }
      })
    }]
  }, true);
};
