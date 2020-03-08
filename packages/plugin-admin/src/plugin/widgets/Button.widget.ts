import { Field, ObjectType } from 'type-graphql';

import { WidgetBase } from './Base.widget';

@ObjectType()
export class WidgetButton extends WidgetBase {
  @Field()
  widget: 'button';

  @Field()
  text?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  icon?: string;
}
