import { WidgetFormFieldUnion, WidgetFormField } from '@brix/plugin-admin';
import { Field, ObjectType } from 'type-graphql';

import { templateFileEngineMap } from '../services/Template.service';


@ObjectType()
export class ETemplate {

  @Field({ nullable: false })
  url: string;

  @Field({ nullable: false })
  name: string;

  @Field(() => [WidgetFormFieldUnion])
  data: WidgetFormField[];

  @Field(() => String)
  type: keyof typeof templateFileEngineMap;
}
