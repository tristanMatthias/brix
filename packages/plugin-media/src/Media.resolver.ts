import { BrixContextUser, ErrorResourceNotFound, FileUpload } from '@brix/core';
import { getStore } from '@brix/model';
import fs from 'fs-extra';
import path from 'path';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import uuid from 'uuid';

import { OPTIONS } from '.';
import { ECreateMediaInput, EMedia, EUpdateMediaInput } from './Media.entity';
import { providers } from './providers';

@Resolver(EMedia)
export class MediaResolver {
  model = getStore().model<EMedia>('Media');
  service = new providers[OPTIONS.provider]();

  constructor() {
    fs.mkdirpSync(path.join(process.cwd(), 'uploads'));
  }

  @Authorized()
  @Query(() => EMedia)
  async media(@Arg('id') id: string) {
    return this.model.findById(id);
  }

  @Authorized()
  @Query(() => [EMedia])
  async mediaList() {
    return this.model.findAll();
  }


  @Authorized()
  @Mutation(() => EMedia)
  async createMedia(
    @Arg('media') media: ECreateMediaInput,
    @Ctx('user') user: BrixContextUser
  ) {
    const { createReadStream, ext, name } = await this._process(media.image);

    const url = await this.service.create(createReadStream, ext, 'media', '', name);

    return await this.model.create({
      author: user.id,
      name,
      url,
      provider: 'filesystem',
      ext
    });
  }


  @Authorized()
  @Mutation(() => EMedia)
  async updateMedia(@Arg('media') media: EUpdateMediaInput) {

    const { createReadStream, ext, name } = await this._process(media.image);
    const url = await this.service.create(createReadStream, ext, 'media', '', name);

    return await this.model.updateById(media.id, {
      name,
      url,
      provider: 'filesystem',
      ext
    });
  }


  @Authorized()
  @Mutation(() => Boolean)
  async deleteMedia(@Arg('id') id: string) {
    const m = await this.model.findById(id);
    if (!m) throw new ErrorResourceNotFound('media', id);
    await this.service.delete(id, m.name);
    return this.model.deleteById(id);
  }


  private async _process(media: FileUpload) {
    const { createReadStream, filename, mimetype } = await media;
    const ext = mimetype.split('/')[1];
    const name = `media.${uuid()}.${filename}`;
    return { createReadStream, ext, name, mimetype };
  }
}
