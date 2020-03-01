import { Field, ObjectType } from 'type-graphql';


@ObjectType()
export class WidgetTableColumns {
  @Field({ nullable: true })
  checkbox?: boolean;

  @Field({ nullable: true })
  header: string;

  @Field()
  accessor: string;

  @Field({ nullable: true })
  width: number;
}

@ObjectType()
export class WidgetTable {
  @Field(() => String)
  widget: 'table';

  @Field(() => WidgetTableColumns)
  columns: WidgetTableColumns[];

  @Field()
  query: string;

  @Field()
  queryKey: string;
}
