import { Field, ObjectType, Query, Resolver } from 'type-graphql';
import { Widget, WidgetUnion } from './Widget.union';

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
  // TODO: Convert to Union
  @Field()
  action: string;

  @Field({ nullable: true })
  query?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  text?: string;
}

@ObjectType()
export class EAdminPage {
  @Field(() => String)
  title: string;

  @Field(() => [WidgetUnion])
  content: Widget[];

  @Field(() => EAdminPageHeader, { nullable: true })
  header?: EAdminPageHeader;
}

@ObjectType()
export class EAdminPageRoot extends EAdminPage {
  @Field()
  icon: string;

  @Field()
  prefix: string;

  @Field(() => [EAdminPage], { nullable: true })
  pages?: EAdminPage[];
}

@Resolver(EAdminPage)
export class AdminResolver {
  @Query(() => [EAdminPageRoot])
  adminPages() {
    return global.BrixAdmin.pages();
  }
}
