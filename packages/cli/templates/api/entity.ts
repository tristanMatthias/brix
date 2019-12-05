import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class EUser {
  @Field()
  name: string;
}
