
export type WidgetType = 'entityGrid';

export class WidgetEntityGridItemMap {
  image: string;
  title: string;
  subTitle: string;
}

export class WidgetEntityGrid {
  widget: 'entityGrid';
  itemMap: WidgetEntityGridItemMap;
  query: string;
  queryKey: string;
}


export type Widget = WidgetEntityGrid;
