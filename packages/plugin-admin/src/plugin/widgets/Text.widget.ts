import { Field, ObjectType } from 'type-graphql';

import { WidgetBase } from './Base.widget';

@ObjectType()
export class WidgetText extends WidgetBase {
  @Field()
  widget: 'text';

  @Field()
  text: string;
}
