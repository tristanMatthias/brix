import { createUnionType } from 'type-graphql';

import { WidgetButton } from './Button.widget';
import { WidgetEntityGrid } from './EntityGrid.widget';
import { WidgetForm } from './Form.widget';
import { WidgetTable } from './Table.widget';
import { WidgetText } from './Text.widget';
import { WidgetQuery } from './Query.widget';
import { WidgetTree } from './Tree.widget';

export { WidgetEntityGrid } from './EntityGrid.widget';
export { WidgetForm } from './Form.widget';
export { WidgetTable } from './Table.widget';
export { WidgetText } from './Text.widget';
export { WidgetButton } from './Button.widget';
export { WidgetFormFieldSelectOption } from './fields/FormField.union';


export type Widget =
  WidgetEntityGrid |
  WidgetTable |
  WidgetText |
  WidgetForm |
  WidgetButton |
  WidgetTree |
  WidgetQuery;


export const WidgetUnion = createUnionType({
  name: 'Widget',
  types: [
    WidgetEntityGrid,
    WidgetTable,
    WidgetText,
    WidgetForm,
    WidgetButton,
    WidgetTree,
    WidgetQuery
  ],
  resolveType: value => {
    switch (value.widget) {
      case 'entityGrid': return WidgetEntityGrid;
      case 'table': return WidgetTable;
      case 'text': return WidgetText;
      case 'form': return WidgetForm;
      case 'button': return WidgetButton;
      case 'tree': return WidgetTree;
      case 'query': return WidgetQuery;
    }
  }
});
