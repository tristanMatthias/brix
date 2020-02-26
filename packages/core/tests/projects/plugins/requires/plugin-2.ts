import { BrixPlugins } from '../../../../src';

export default () => {
  BrixPlugins.register({
    name: 'plugin-two',
    requires: ['plugin-one']
  }, true);
};
