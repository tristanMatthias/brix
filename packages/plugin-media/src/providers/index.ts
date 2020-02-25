import { FileUpload } from '@brix/core';
import { Stream } from 'stream';

import { ProviderType } from '..';
import { FileSystemService } from './filesystem';
import { CloudinaryService } from './cloudinary';

export interface Provider {
  create(
    createReadStream: FileUpload['createReadStream'],
    ext: string,
    entityType: string,
    entityId: string,
    name: string
  ): Promise<string>;

  delete(id: string, name: string): Promise<boolean>;

  stream(id: string, name: string): Stream;
}

export const providers: { [key in ProviderType]: { new(): Provider } } = {
  filesystem: FileSystemService,
  cloudinary: CloudinaryService
};
