import { BrixPlugins } from '../../../../src';

export default () => {
  BrixPlugins.register({
    name: 'raise-error'
  });
  throw new Error('raise-error');
};
