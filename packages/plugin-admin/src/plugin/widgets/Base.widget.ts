import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class WidgetBase {
  @Field({ nullable: true, defaultValue: true })
  card?: boolean;

  @Field({ nullable: true })
  cardPadding?: number;

  @Field({ nullable: true, defaultValue: 3 })
  width?: number;
}
