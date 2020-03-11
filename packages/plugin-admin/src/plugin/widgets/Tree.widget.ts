import { Field, ObjectType } from 'type-graphql';

import { WidgetBase } from './Base.widget';

@ObjectType()
export class WidgetTreeMap {
  @Field()
  title: string;

  @Field()
  value: string;

  @Field({ nullable: true })
  subtitle?: string;

  @Field({ nullable: true })
  children?: string;
}

@ObjectType()
export class WidgetTree extends WidgetBase {
  @Field()
  widget: 'tree';

  // @Field()
  // query: string;

  // @Field()
  // queryKey: string;

  @Field(() => WidgetTreeMap)
  map: WidgetTreeMap;
}
