import { BrixPlugins, Config } from '../../../../../src';

export default async (options: any) => {
  await Config.update({ clsNamespace: options.namespace });
  BrixPlugins.register({
    name: 'plugin-with-options'
  });
};
