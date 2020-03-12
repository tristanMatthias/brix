import { Field, ObjectType } from 'type-graphql';

import { WidgetBase } from './Base.widget';
import { ActionUnion, Action } from '../actions/Action.union';

@ObjectType()
export class WidgetButtonBase extends WidgetBase {
  @Field()
  text?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  circle?: boolean;

  @Field({ nullable: true })
  hollow?: boolean;

  @Field(() => ActionUnion, { nullable: true })
  action?: Action;
}

@ObjectType()
export class WidgetButton extends WidgetButtonBase {
  @Field()
  widget: 'button';
}
