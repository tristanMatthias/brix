import { Column } from 'react-table';

import { IconType } from '../components/Icon/Icon';
import { Color } from './classes';
import { Action } from '../hooks/useAction';
import { SelectProps } from '../components/Select/Select';
import { TreeProps } from '../components/Tree/Tree';

export type Widget =
  WidgetQuery |
  WidgetEntityGrid |
  WidgetTable |
  WidgetText |
  WidgetForm |
  WidgetFormField;


// ------------------------------------------------------------------------ Base
export class WidgetBase {
  card?: boolean;
  cardPadding?: number;
  width?: number;
}
// ----------------------------------------------------------------------- Query
export class WidgetQuery {
  widget: 'query';
  query: string;
  resultKey: string;
  variables: { [key: string]: string };
}

// ----------------------------------------------------------------- Entity Grid
export class WidgetEntityGridItemMap extends WidgetBase {
  image: string;
  title: string;
  subTitle: string;
}

export class WidgetEntityGrid extends WidgetBase {
  widget: 'entityGrid';
  itemMap: WidgetEntityGridItemMap;
  query: string;
  queryKey: string;
}

// ----------------------------------------------------------------------- Table
export class WidgetTable extends WidgetBase {
  widget: 'table';
  columns?: Column[];
  query: string;
  queryKey: string;
  rowClick?: Action;
}

// ------------------------------------------------------------------------ Text
export class WidgetText extends WidgetBase {
  widget: 'text';
  text: string;
}

// ---------------------------------------------------------------------- Button
export class WidgetButton extends WidgetBase {
  widget: 'button';
  text: string;
  color?: Color;
  icon?: IconType;
  circle?: boolean;
  hollow?: boolean;
}


// ------------------------------------------------------------------------ Form
export class WidgetForm extends WidgetBase {
  widget: 'form';
  fields: WidgetFormField[];
  query: string;
  variableKey: string;
  // TODO: Turn into something better
  values?: 'query';
}

export class WidgetFormFieldBase {
  name: string;
  default?: string;
}

export class WidgetFormFieldText extends WidgetFormFieldBase {
  widget: 'input';
  type: 'text' | 'number' | 'color' | 'email' | 'textarea';
  placeholder?: string;
}

export class WidgetFormFieldCheckbox extends WidgetFormFieldBase {
  widget: 'checkbox';
}
export class WidgetFormFieldSelect extends WidgetFormFieldBase {
  widget: 'select';
  options: SelectProps[];
}
export class WidgetFormFieldTree extends WidgetFormFieldBase {
  widget: 'tree';
  map: TreeProps['map'];
}


export type WidgetFormField =
  WidgetFormFieldText |
  WidgetFormFieldCheckbox |
  WidgetFormFieldSelect |
  WidgetFormFieldTree |
  WidgetButton;


// // ------------------------------------------------------------------------ Tree
// export class WidgetTree extends WidgetBase {
//   widget: 'tree';
//   query: string;
//   queryKey: string;
//   map: TreeProps['map'];
// }
