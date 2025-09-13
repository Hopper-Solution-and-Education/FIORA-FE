import { ReactNode } from 'react';

export type TableAlign = 'left' | 'center' | 'right';

export type ColumnKey = string;

export type ColumnRenderer<T> = (row: T) => ReactNode;

export interface CommonTableColumn<T> {
  key: ColumnKey;
  title: ReactNode;
  width?: number | string;
  align?: TableAlign;
  className?: string;
  headClassName?: string;
  render?: ColumnRenderer<T>;
}

export interface ColumnVisibilityConfig {
  isVisible: boolean;
  index: number;
  align?: TableAlign;
}

export type ColumnConfigMap = Record<ColumnKey, ColumnVisibilityConfig>;

export interface CommonTableProps<T> {
  data: T[];
  columns: CommonTableColumn<T>[];
  columnConfig: ColumnConfigMap;
  onColumnConfigChange?: (config: ColumnConfigMap) => void;
  storageKey?: string;
  loading?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
  rightHeaderNode?: ReactNode;
  leftHeaderNode?: ReactNode;
  emptyState?: ReactNode;
  skeletonRows?: number;
  loadingMoreRows?: number;
}
