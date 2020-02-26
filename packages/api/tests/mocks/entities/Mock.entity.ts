import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class EMock {
  @Field()
  test: number;
}
