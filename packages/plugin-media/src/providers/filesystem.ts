import { logger, FileUpload } from '@brix/core';
import fs from 'fs-extra';
import path from 'path';

import { Provider } from '.';
import { OPTIONS } from '..';

export class FileSystemService implements Provider {
  async create(
    createReadStream: FileUpload['createReadStream'],
    _ext: string,
    _entityType: string,
    _entityId: string,
    name: string
  ) {
    const fp = this._getFP(name);
    const stream = fs.createWriteStream(fp);

    return new Promise<string>(async (res, rej) =>
      createReadStream()
        .pipe(stream)
        .on('finish', () => res(this._getUrl(name)))
        // TODO: Handle error gracefully
        .on('error', e => {
          logger.error(e);
          rej(false);
        })
    );
  }

  async delete(_id: string, name: string) {
    await fs.unlink(this._getFP(name));
    return true;
  }

  stream(_id: string, name: string) {
    return fs.createReadStream(this._getFP(name));
  }

  private _getFP(name: string) {
    return path.resolve(OPTIONS.uploadsDir, name);
  }

  private _getUrl(name: string) {
    return path.resolve(OPTIONS.prefix, name);
  }
}
