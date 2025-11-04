import { HTMLAttributes, ReactNode } from 'react';

export type TableAlign = 'left' | 'center' | 'right';

export type ColumnKey = string;

export type ColumnRenderer<T> = (row: T) => ReactNode;

export interface CommonTableColumn<T> {
  key: ColumnKey;
  title: ReactNode;
  width?: number | string;
  align?: TableAlign;
  headClassName?: string;
  render?: ColumnRenderer<T>;

  /**
   * A plain text representation of the column title.
   * Useful for accessibility, tooltips, or text truncation when `title` is a complex ReactNode.
   */
  titleText?: string;
}

export interface ColumnVisibilityConfig {
  isVisible: boolean;
  index: number;

  // alignOverride: runtime/user preference that overrides column.align (schema default)
  // If undefined, fall back to the column's default align.
  alignOverride?: TableAlign;
}

export type ColumnConfigMap = Record<ColumnKey, ColumnVisibilityConfig>;

export interface CommonTableProps<T> extends HTMLAttributes<HTMLDivElement> {
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
  columnConfigMenuProps?: React.HTMLAttributes<HTMLDivElement>;
  deps?: any[];
}
