import { Field, ObjectType } from 'type-graphql';

import { WidgetBase } from './Base.widget';
import { Action, ActionUnion } from '../actions/Action.union';


@ObjectType()
export class WidgetEntityGridItemMap {
  @Field({ nullable: true })
  image?: string;

  @Field()
  title: string;

  @Field()
  subTitle: string;
}

@ObjectType()
export class WidgetEntityGrid extends WidgetBase {
  @Field(() => String)
  widget: 'entityGrid';

  @Field(() => WidgetEntityGridItemMap)
  itemMap: WidgetEntityGridItemMap;

  @Field()
  query: string;

  @Field()
  queryKey: string;

  @Field(() => ActionUnion, { nullable: true })
  clickAction?: Action;
}
