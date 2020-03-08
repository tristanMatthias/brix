import { Field, ObjectType } from 'type-graphql';


@ObjectType()
export class ActionUpload {
  @Field()
  action: 'upload';

  @Field()
  query: string;
}
