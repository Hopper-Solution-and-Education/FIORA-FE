import type React from 'react';
import type { ReactNode } from 'react';

import { CheckboxProps } from '@radix-ui/react-checkbox';

export interface TablePaginationProps {
  position?: PaginationPositionProps;
  current?: number;
  pageSize?: number;
  total?: number;
  onChange?: (page: number, pageSize: number) => void;
}

export type DataSourceProps = {
  [x: string | number | symbol]: string | number | unknown;
};

export enum PAGINATION_POSITION {
  TOP_LEFT = 'topLeft',
  TOP_RIGHT = 'topRight',
  BOTTOM_LEFT = 'bottomLeft',
  BOTTOM_RIGHT = 'bottomRight',
}

export type TableSizeProps = 'small' | 'middle';

export type PaginationPositionProps =
  | PAGINATION_POSITION.TOP_LEFT
  | PAGINATION_POSITION.TOP_RIGHT
  | PAGINATION_POSITION.BOTTOM_LEFT
  | PAGINATION_POSITION.BOTTOM_RIGHT;

export enum SORT_ORDER {
  ASCEND = 'ascend',
  DESCEND = 'descend',
}

export type SortOrderProps = SORT_ORDER.ASCEND | SORT_ORDER.DESCEND | null;

export interface SortOrderStateProps {
  [x: string | number | symbol]: SortOrderProps;
}

export interface ColumnProps {
  title?: React.ReactNode;
  dataIndex?: string;
  key: string;
  align?: 'left' | 'center' | 'right' | string;
  headerAlign?: 'left' | 'center' | 'right' | string;
  width?: string | number;
  render?: (text: any, record: any, index: number) => React.ReactNode;
  fixed?: 'left' | 'right' | string;
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
}

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
