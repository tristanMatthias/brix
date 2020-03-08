import { BrixPlugins } from '@brix/core';
import path from 'path';
import { MediaResolver } from './Media.resolver';
import '@brix/plugin-admin';


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
    resolvers: [MediaResolver]
  });


  if (global.BrixAdmin) {
    global.BrixAdmin.register({
      icon: 'images',
      path: '/media',
      title: 'Media',
      header: {
        heading: 'Media',
        icon: 'images',
        buttons: [
          {
            action: {
              action: 'upload',
              query: `
              mutation($file: ECreateMediaInput!) {
                createMedia(media: $file) {
                  id
                  name
                  url
                  ext
                }
              }`
            },
            icon: 'upload',
            text: 'Upload Image',
            color: 'success'
          }
        ]
      },
      content: [{
        widget: 'entityGrid',
        itemMap: {
          image: 'url',
          title: 'name',
          subTitle: 'createdAt'
        },
        query: `{mediaList{url name ext createdAt}}`,
        queryKey: 'mediaList'
      }]
    });
  }

};
