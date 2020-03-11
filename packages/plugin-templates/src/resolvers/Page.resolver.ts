import { BrixContextUser } from '@brix/core';
import { getStore } from '@brix/model';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver, FieldResolver, Root } from 'type-graphql';
import { User } from '@brix/plugin-entity-user';

import { ECreatePageInput, EPage, EUpdatePageInput } from '../entities/Page.entity';
import { TemplateService } from '../services/Template.service';


@Resolver(EPage)
export class PageResolver {
  model = getStore().model<EPage>('Page');
  user = getStore().model<EPage>('User');

  @Authorized()
  @Query(() => EPage)
  async page(@Arg('id') id: string) {
    return this.model.findById(id);
  }

  @Authorized()
  @Query(() => [EPage])
  async pages() {
    return await this.model.findAll();
  }


  @Authorized()
  @Mutation(() => EPage)
  async createPage(
    @Arg('page') page: ECreatePageInput,
    @Ctx('user') user: BrixContextUser
  ) {
    return await this.model.create({
      ...page,
      authorId: user?.id
    });
  }


  @Authorized()
  @Mutation(() => EPage)
  async updatePage(@Arg('page') page: EUpdatePageInput) {
    return await this.model.updateById(page.id, page);
  }


  @Authorized()
  @Mutation(() => Boolean)
  async deletePage(@Arg('id') id: string) {
    return this.model.deleteById(id);
  }


  // ----------------------------------------------------------- Field resolvers
  @FieldResolver(() => User)
  author(@Root() page: EPage) {
    return this.user.findById(page.authorId);
  }

  @FieldResolver(() => User)
  template(@Root() page: EPage) {
    return TemplateService.findByUrl(page.template);
  }
}
