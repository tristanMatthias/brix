import { BrixPlugins } from '../../../../../src';

export default () => {
  BrixPlugins.register({
    name: 'plugin-1',
    middlewares: [() => { }]
  });
};
