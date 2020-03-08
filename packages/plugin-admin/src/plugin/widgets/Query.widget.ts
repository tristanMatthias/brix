import { Field, ObjectType } from 'type-graphql';
import { GraphQLJSON } from '@brix/core';

@ObjectType()
export class WidgetQuery {
  @Field()
  widget: 'query';

  @Field()
  query: string;

  @Field()
  resultKey: string;

  @Field(() => GraphQLJSON)
  variables: object;
}
