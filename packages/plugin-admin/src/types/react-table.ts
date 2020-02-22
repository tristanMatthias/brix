// @ts-ignore We want to import this for the types to work
import * as ReactTable from 'react-table';

declare module 'react-table' {
  export interface Column {
    className?: string;
    ellipsis?: boolean;
    maxWidth?: string | number;
    minWidth?: string | number;
    canSort?: boolean;
  }
  export interface TableInstance {
    getToggleAllRowsSelectedProps(): any;
  }
  export interface Row {
    getToggleRowSelectedProps(): any;
    isSelected: boolean;
  }
}
