import { Field, ObjectType } from 'type-graphql';


@ObjectType()
export class ActionLink {
  @Field()
  action: 'link';

  @Field()
  to: string;
}
