import { Field, ObjectType } from 'type-graphql';

import { Action, ActionUnion } from '../actions/Action.union';
import { WidgetBase } from './Base.widget';


@ObjectType()
export class WidgetTableColumns {
  @Field({ nullable: true })
  accessor?: string;

  @Field({ nullable: true })
  cell?: string;

  @Field({ nullable: true })
  checkbox?: boolean;

  @Field({ nullable: true })
  header?: string;

  @Field({ nullable: true })
  width?: number;
}

@ObjectType()
export class WidgetTable extends WidgetBase {
  @Field(() => String)
  widget: 'table';

  @Field(() => WidgetTableColumns)
  columns: WidgetTableColumns[];

  @Field()
  query: string;

  @Field()
  queryKey: string;

  @Field(() => ActionUnion, { nullable: true })
  rowClick?: Action;
}
