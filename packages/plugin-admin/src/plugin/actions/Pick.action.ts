import { Field, ObjectType } from 'type-graphql';

import { WidgetEntityGridItemMap } from '../widgets/EntityGrid.widget';


@ObjectType()
export class ActionPick {
  @Field()
  action: 'pick';

  @Field({ nullable: true })
  title: string;

  @Field(() => WidgetEntityGridItemMap)
  itemMap: WidgetEntityGridItemMap;

  @Field()
  query: string;

  @Field()
  queryKey: string;

  @Field({ nullable: true })
  pickKey: string;
}

@ObjectType()
export class ActionSelect {
  @Field()
  action: 'select';

  @Field()
  selectId: string;
}
