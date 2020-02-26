import { BrixPlugins } from '../../../../src';

export default () => {
  BrixPlugins.register({
    name: 'plugin-one'
  }, true);
};
