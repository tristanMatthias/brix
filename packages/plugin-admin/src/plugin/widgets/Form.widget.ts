import { Field, ObjectType } from 'type-graphql';

import { WidgetBase } from './Base.widget';
import { WidgetFormField, WidgetFormFieldUnion } from './fields/FormField.union';

@ObjectType()
export class WidgetForm extends WidgetBase {
  @Field()
  widget: 'form';

  @Field(() => [WidgetFormFieldUnion])
  fields: WidgetFormField[];

  @Field()
  query: string;

  @Field()
  variableKey: string;

  @Field({ nullable: true })
  values?: string;
}
