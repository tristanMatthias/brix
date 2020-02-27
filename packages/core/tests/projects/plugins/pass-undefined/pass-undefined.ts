import { BrixPlugins } from '../../../../src';

export const spyOnThis = {
  calledIfUndefined: () => true
};

export default (options?: any) => {
  if (options === undefined) spyOnThis.calledIfUndefined();
  BrixPlugins.register({ name: 'pass-undefined' }, true);
};
