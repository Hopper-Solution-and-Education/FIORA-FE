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

export enum FIXED {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface DataSourceItemProps {
  [key: string]: any;
  value: string | number;
  render?: React.ReactNode;
}

export interface DataSourceProps {
  key: string;
  children?: DataSourceProps[];
  rowSpan?: number;
  colSpan?: number;
  parent?: DataSourceProps[];
  isParent?: boolean;
  isChild?: boolean;
  parentName?: string;
  onClick?: () => void;
  [key: string]:
    | DataSourceItemProps
    | React.ReactNode
    | DataSourceProps[]
    | Record<string, DataSourceItemProps | React.ReactNode>
    | (() => void)
    | undefined;
}

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

export type Fixed = FIXED.LEFT | FIXED.RIGHT | string;

export type SortOrderProps = SORT_ORDER.ASCEND | SORT_ORDER.DESCEND | null;

export interface SortOrderStateProps {
  [x: string | number | symbol]: SortOrderProps;
}

export interface ColumnProps {
  title?: React.ReactNode | string;
  dataIndex?: string;
  key: string;
  align?: CanvasTextAlign;
  headerAlign?: CanvasTextAlign;
  width?: string | number;
  render?: (text: any, record: any, index: number) => React.ReactNode;
  ellipsis?: boolean;
  bgColorClassName?: string;
  className?: string;
  fixed?: Fixed;
  sorter?: ((a: any, b: any) => number) | boolean;
  sortOrder?: SortOrderProps[];
  colSpan?: number;
  children?: ColumnProps[];
  helpContent?: string | ReactNode;
  getIsSorted?: SortOrderProps;
  getCanSort?: boolean;
  getToggleSortingHandler?: () => Promise<void | boolean> | void | boolean;
  onSorterClick?: (
    column: Pick<ColumnProps, 'key' | 'dataIndex'> & {
      sortOrder: SortOrderProps;
    },
  ) => Promise<void | boolean> | void | boolean;
  onCell?: (
    record: any,
    rowIndex: number,
  ) => {
    rowSpan?: number;
    colSpan?: number;
  };
}

export interface TableV2Meta {
  headerAlign?: CanvasTextAlign;
  align?: CanvasTextAlign;
  width?: string | number;
  fixed?: Fixed;
  bgColorClassName?: string;
  className?: string;
  ellipsis?: boolean;
  colSpan?: number;
  render?: (text: any, record: any, index: number) => React.ReactNode;
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
  accessorKey?: string;
  meta?: TableV2Meta;
  render?: (text: any, record: T, index: number) => React.ReactNode;
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
  loadingRowCount?: number;
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
