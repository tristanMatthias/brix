import { BrixPlugins } from '@brix/core';
import path from 'path';
import { MediaResolver } from './Media.resolver';


export type ProviderType = 'filesystem' | 'cloudinary';
export type PluginOptionsBase = {
  uploadsDir: string
  prefix: string;
  provider: ProviderType;
};


export const OPTIONS: PluginOptionsBase = {
  provider: 'filesystem',
  prefix: '/uploads',
  // TODO: Move to Config.rootDir
  uploadsDir: path.join(process.cwd(), 'uploads')
};

export default (options: Partial<PluginOptionsBase>) => {
  if (options) Object.assign(OPTIONS, options);

  switch (OPTIONS.provider) {
    case undefined:
    case 'cloudinary':
    case 'filesystem':
      break;
    default:
      throw new Error(`[PluginMedia] Invalid provider option '${OPTIONS.provider}'`);
  }

  BrixPlugins.register({
    name: 'Media',
    // @ts-ignore
    resolvers: [MediaResolver]
  });

};
