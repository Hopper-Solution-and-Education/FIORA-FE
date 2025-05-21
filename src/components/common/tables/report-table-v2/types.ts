import type React from 'react';
import type { ReactNode } from 'react';

import { CheckboxProps } from '@radix-ui/react-checkbox';
import { ColumnDef } from '@tanstack/react-table';

export enum PAGINATION_POSITION {
  TOP_LEFT = 'topLeft',
  TOP_RIGHT = 'topRight',
  BOTTOM_LEFT = 'bottomLeft',
  BOTTOM_RIGHT = 'bottomRight',
}

export type TableSizeProps = 'small' | 'middle';

export enum SORT_ORDER {
  ASCEND = 'asc',
  DESCEND = 'desc',
}

export enum ALIGNMENT {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

export enum FIXED {
  LEFT = 'left',
  RIGHT = 'right',
}

export type DataSourceProps = {
  [x: string | number | symbol]: string | number | unknown;
};

export interface TablePaginationProps {
  position?: PaginationPositionProps;
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
}

export type PaginationPositionProps =
  | PAGINATION_POSITION.TOP_LEFT
  | PAGINATION_POSITION.TOP_RIGHT
  | PAGINATION_POSITION.BOTTOM_LEFT
  | PAGINATION_POSITION.BOTTOM_RIGHT;

export type Align = ALIGNMENT.LEFT | ALIGNMENT.CENTER | ALIGNMENT.RIGHT | string;

export type Fixed = FIXED.LEFT | FIXED.RIGHT | string;

export type SortOrderProps = SORT_ORDER.ASCEND | SORT_ORDER.DESCEND | null;

export interface SortOrderStateProps {
  [x: string | number | symbol]: SortOrderProps;
}

export interface ColumnProps {
  title?: React.ReactNode | string;
  dataIndex?: string;
  key: string;
  align?: Align;
  headerAlign?: Align;
  width?: string | number;
  render?: (text: any, record: any, index: number) => React.ReactNode;
  fixed?: Fixed;
  sorter?: ((a: any, b: any) => number) | boolean;
  onSorterClick?: (
    column: Pick<ColumnProps, 'key' | 'dataIndex'> & {
      sortOrder: SortOrderProps;
    },
  ) => Promise<void | boolean> | void | boolean;
  sortOrder?: SortOrderProps[];
  className?: string;
  ellipsis?: boolean;
  colSpan?: number;
  onCell?: (
    record: any,
    rowIndex: number,
  ) => {
    rowSpan?: number;
    colSpan?: number;
  };
  children?: ColumnProps[];
  helpContent?: string | ReactNode;
  getIsSorted?: SortOrderProps;
  getCanSort?: boolean;
  getToggleSortingHandler?: () => Promise<void | boolean> | void | boolean;
}

export interface CustomColumnMeta {
  align?: Align;
  width?: string | number;
  fixed?: Fixed;
  className?: string;
  ellipsis?: boolean;
  colSpan?: number;
  onCell?: (
    record: any,
    rowIndex: number,
  ) => {
    rowSpan?: number;
    colSpan?: number;
  };
}

// Then modify the column definition to use this type
export type CustomColumnDef<T> = ColumnDef<T> & {
  meta?: CustomColumnMeta;
};

export interface ScrollProps {
  x?: number | string;
  y?: number | string;
}

export interface RowSelectionProps {
  selectedRowKeys?: (string | number)[];
  hideSelectAll?: boolean;
  onChange?: (selectedRowKeys: (string | number)[], selectedRows: DataSourceProps[]) => void;
  onSelect?: (record: any, selected: boolean, selectedRows: DataSourceProps[]) => void;
  onSelectAll?: (selected: boolean, selectedRows: DataSourceProps[]) => void;
  onSelectNone?: () => void;
  getCheckboxProps?: (record: any) => CheckboxProps;
}

export interface TableProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: ColumnProps[];
  dataSource?: DataSourceProps[];
  bordered?: boolean;
  layoutBorder?: boolean;
  showHeader?: boolean;
  scroll?: ScrollProps;
  rowSelection?: RowSelectionProps;
  rowKey?: string;
  loading?: boolean;
  pagination?: TablePaginationProps | boolean | null;
  size?: TableSizeProps;
  emptyText?: string;
  rowHover?: boolean;
  rowCursor?: boolean;
  onRowClick?: (val: any) => void;
  idBody?: string;
  isResetSelection?: boolean;
  indexSelected?: number;
  showPagination?: boolean;
  paginationEnabled?: boolean;
}
