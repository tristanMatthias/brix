import { Field, ObjectType, Query, Resolver } from 'type-graphql';

import { ActionUnion, Action } from './actions/Action.union';
import { Widget, WidgetUnion } from './widgets/Widget.union';

@ObjectType()
export class EAdminPageHeader {
  @Field(() => String)
  heading: string;

  @Field(() => String, { nullable: true })
  icon: string;

  @Field(() => [EAdminPageHeaderButton], { nullable: true })
  buttons?: EAdminPageHeaderButton[];
}

@ObjectType()
export class EAdminPageHeaderButton {
  @Field(() => ActionUnion)
  action: Action;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  text?: string;
}


@ObjectType()
export class EAdminPageMenuItem {
  @Field()
  to: string;

  @Field()
  text: string;

  @Field({ nullable: true })
  icon?: string;
}

@ObjectType()
export class EAdminPage {
  @Field(() => String)
  path: string;

  @Field(() => String)
  title: string;

  @Field(() => [WidgetUnion])
  content: Widget[];

  @Field(() => EAdminPageHeader, { nullable: true })
  header?: EAdminPageHeader;

  @Field(() => EAdminPage, { nullable: true })
  pages?: EAdminPage[];

  @Field({ nullable: true })
  query?: string;

  @Field({ nullable: true })
  queryKey?: string;

  @Field(() => [EAdminPageMenuItem], { nullable: true })
  menu?: EAdminPageMenuItem[];
}

@ObjectType()
export class EAdminApp extends EAdminPage {
  @Field()
  icon: string;
}

@Resolver(EAdminPage)
export class AdminResolver {
  @Query(() => [EAdminApp])
  adminApps() {
    return global.BrixAdmin.pages();
  }
}
