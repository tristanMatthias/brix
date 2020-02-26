import { BrixPlugins } from '../../../../src';

export default () => {
  BrixPlugins.register({
    name: 'missing-requirement',
    requires: ['missing']
  }, true);
};
