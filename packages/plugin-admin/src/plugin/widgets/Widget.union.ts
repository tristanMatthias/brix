import { createUnionType } from 'type-graphql';

import { WidgetEntityGrid } from './EntityGrid.widget';
import { WidgetTable } from './Table.widget';

export type WidgetType = 'entityGrid' | 'table';


export type Widget = WidgetEntityGrid | WidgetTable;


export const WidgetUnion = createUnionType({
  name: 'Widget',
  types: [
    WidgetEntityGrid,
    WidgetTable
  ],
  resolveType: value => {
    switch (value.widget) {
      case 'entityGrid': return WidgetEntityGrid;
      case 'table': return WidgetTable;
    }
  }
});
