import { FileUpload } from '@brix/core';
import { v2 as cloudinary } from 'cloudinary';
import request from 'request-promise';

import { Provider } from '.';
import { OPTIONS, PluginOptionsBase } from '..';

export interface CloudinaryServiceOptions extends PluginOptionsBase {
  apiKey: string;
  apiSecret: string;
  cloudName: string;
}

export class CloudinaryService implements Provider {
  options = OPTIONS as CloudinaryServiceOptions;

  constructor() {
    cloudinary.config({
      api_key: this.options.apiKey,
      api_secret: this.options.apiSecret,
      cloud_name: this.options.cloudName
    });
  }

  async create(
    createReadStream: FileUpload['createReadStream'],
    _ext: string,
    _entityType: string,
    entityId: string,
    _name: string
  ) {
    return await new Promise<string>(async (res, rej) => {
      const stream = cloudinary.uploader.upload_stream({ public_id: entityId }, (err, image) => {
        if (err) return rej(err);
        res(image.url);
      }) as unknown as NodeJS.WritableStream;
      (await createReadStream()).pipe(stream);
    });
  }

  async delete(id: string, _name: string) {
    return await new Promise<boolean>((res, rej) => {
      cloudinary.uploader.destroy(id, err => {
        if (err) rej(err);
        else res(true);
      });
    });
  }

  stream(id: string, name: string) {
    const ext = name.split('.').pop();
    return request(`https://res.cloudinary.com/${this.options.cloudName}/image/upload/${id}.${ext}`);
  }
}
