import { getStore } from '@brix/model';
import { Arg, Authorized, Mutation, Query, Resolver, FieldResolver, Root } from 'type-graphql';

import { ECreateMenuInput, EMenu, EUpdateMenuInput, EMenuItem } from '../entities/Menu.entity';
import { EPage } from '../entities/Page.entity';


@Resolver(EMenu)
export class MenuResolver {
  model = getStore().model<EMenu>('Menu');

  // @Authorized()
  @Query(() => EMenu)
  async menu(@Arg('id') id: string) {
    return this.model.findById(id);
  }

  // @Authorized()
  @Query(() => [EMenu])
  async menus() {
    return await this.model.findAll();
  }


  @Authorized()
  @Mutation(() => EMenu)
  async createMenu(@Arg('menu') menu: ECreateMenuInput) {
    return await this.model.create(menu);
  }


  @Authorized()
  @Mutation(() => EMenu)
  async updateMenu(@Arg('menu') menu: EUpdateMenuInput) {
    return await this.model.updateById(menu.id, menu);
  }


  @Authorized()
  @Mutation(() => Boolean)
  async deleteMenu(@Arg('id') id: string) {
    return this.model.deleteById(id);
  }

  // ----------------------------------------------------------- Field resolvers
  @FieldResolver(() => Number)
  size(@Root() menuItem: EMenuItem) {
    const getSize = (i: EMenuItem): number => {
      if (!i.items || !i.items.length) return 1;

      return 1 + i.items.reduce((s, cur) => {
        return s + getSize(cur);
      }, 0);
    };

    return getSize(menuItem) - 1;
  }
}


@Resolver(EMenuItem)
export class MenuItemResolver {
  pages = getStore().model<EPage>('Page');

  // ----------------------------------------------------------- Field resolvers
  @FieldResolver(() => EPage)
  page(@Root() menuItem: EMenuItem) {
    return this.pages.findById(menuItem.pageId);
  }
}
