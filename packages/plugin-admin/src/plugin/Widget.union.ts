import { createUnionType, Field, ObjectType } from 'type-graphql';

export type WidgetType = 'entityGrid';
// export enum WidgetType {
//   entityGrid = 'entityGrid'
// }


// ----------------------------------------------------------------- Entity Grid
@ObjectType()
export class WidgetEntityGridItemMap {
  @Field()
  image: string;

  @Field()
  title: string;

  @Field()
  subTitle: string;
}

@ObjectType()
export class WidgetEntityGrid {
  @Field(() => String)
  widget: 'entityGrid';

  @Field(() => WidgetEntityGridItemMap)
  itemMap: WidgetEntityGridItemMap;

  @Field()
  query: string;

  @Field()
  queryKey: string;
}


export type Widget = WidgetEntityGrid;


export const WidgetUnion = createUnionType({
  name: 'Widget',
  types: [
    WidgetEntityGrid
  ],
  resolveType: value => {
    switch (value.widget) {
      case 'entityGrid': return WidgetEntityGrid;
    }
  }
});
