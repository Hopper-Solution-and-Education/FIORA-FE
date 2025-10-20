'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { PaginationV2 } from '@/components/ui/pagination-v2';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ImgEmpty } from '@/shared/assets/icons';
import { cn } from '@/shared/utils';
import {
  Cell,
  CellContext,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
  type Column,
  type SortingState,
  type Updater,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './style.css';
import {
  DataSourceProps,
  FIXED,
  PAGINATION_POSITION,
  SORT_ORDER,
  TableV2Meta,
  type ColumnProps,
  type CustomColumnDef,
  type SortOrderStateProps,
  type TableProps,
} from './types';

export function TableV2({
  columns = [],
  dataSource = [],
  bordered = false,
  layoutBorder = false,
  showHeader = true,
  scroll,
  rowSelection,
  rowKey = 'key',
  loading = false,
  loadingRowCount = 10,
  pagination = {
    position: PAGINATION_POSITION.BOTTOM_RIGHT,
    pageSize: 10,
    current: 1,
    total: 0,
  },
  size = 'middle',
  emptyText = 'No data',
  rowHover = true,
  rowCursor = false,
  onRowClick,
  idBody,
  isResetSelection = false,
  indexSelected,
  showPagination = true,
  paginationEnabled = true,
  className,
  tableContainerClassName,
  tableHeight,
  ...rest
}: TableProps) {
  // Header sticky
  const headerRef = useRef<HTMLTableSectionElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // Ref and state to save the actual height of each fixed top row
  const rowRefs = useRef<Record<string | number, HTMLTableRowElement | null>>({});
  const [rowHeights, setRowHeights] = useState<Record<string | number, number>>({});

  useLayoutEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
    // Get the actual height of each fixed top row
    const heights: Record<string | number, number> = {};
    Object.entries(rowRefs.current).forEach(([key, el]) => {
      if (el) heights[key] = el.getBoundingClientRect().height;
    });
    setRowHeights(heights);
  }, [showHeader, columns, size, dataSource]);

  const stickyTopOffsets = useMemo(() => {
    let offset = headerHeight;
    const offsets: Record<string | number, number> = {};
    dataSource.forEach((row) => {
      if (row.fixed === 'top') {
        const key = row[rowKey] as string | number;
        if (typeof key === 'string' || typeof key === 'number') {
          offsets[key] = offset;
          // Get height of row
          offset += rowHeights[key] || 55;
        }
      }
    });
    return offsets;
  }, [dataSource, rowKey, headerHeight, rowHeights]);

  const containerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);

  // SORTING AND SELECTION STATES
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelectedState, setRowSelectedState] = useState<Record<string, boolean>>({});
  const [sortOrderState, setSortOrderState] = useState<SortOrderStateProps>({});

  // Reset selection when isResetSelection changes
  useEffect(() => {
    if (isResetSelection) {
      setRowSelectedState({});
    }
  }, [isResetSelection]);

  // Set selected row by index, preserving existing selections
  useEffect(() => {
    if (indexSelected !== undefined && dataSource && dataSource.length > 0) {
      const selectedRow = dataSource[indexSelected];
      if (selectedRow) {
        const key = selectedRow[rowKey] as string;
        setRowSelectedState((prev) => ({ ...prev, [key]: true }));
      }
    }
  }, [indexSelected, dataSource, rowKey]);

  const createRowContext = (data: any, index: number, table: any) => {
    return {
      original: data,
      index,
      id: data[rowKey] as string,
      getValue: (columnId: string) => data[columnId],
      _getAllCellsByColumnId: () => ({}),
      _uniqueValuesCache: new Map(),
      _valuesCache: new Map(),
      depth: 0,
      subRows: [],
      getVisibleCells: () => [],
      getAllCells: () => [],
      getIsSelected: () => false,
      getIsAllSubRowsSelected: () => false,
      getCanSelect: () => false,
      getCanSelectSubRows: () => false,
      getCanMultiSelect: () => false,
      getCanExpand: () => false,
      getIsExpanded: () => false,
      getToggleExpandedHandler: () => () => {},
      getLeafRows: () => [],
      table,
    } as unknown as Row<any>;
  };

  // Transform columns to TanStack format
  const tableColumns = useMemo(() => {
    const transformColumns = (cols: ColumnProps[]): CustomColumnDef<any>[] => {
      const columns = cols
        .map((col: ColumnProps) => {
          if (!col) return null;

          if (col.children?.length) {
            return {
              id: col.key,
              header: col.title || col.key,
              columns: transformColumns(col.children),
              meta: {
                ...col,
                fixed: col.fixed,
                align: col.align as CanvasTextAlign,
                headerAlign: col.headerAlign as CanvasTextAlign,
                bgColor: col.bgColorClassName,
              },
            } as CustomColumnDef<any>;
          }

          const columnDef: CustomColumnDef<any> = {
            id: col.key,
            accessorKey: col.dataIndex,
            header: ({ column }: { column: Column<any> }) => {
              if (!column) return null;
              const isSorted = column.getIsSorted();
              const canSort = column.getCanSort();
              const headerAlignClass = col.headerAlign
                ? `justify-${col.headerAlign}`
                : 'justify-start';
              const width = col.width ? `w-[${col.width}px]` : 'w-full';

              return (
                <button
                  data-test="table-v2-header-sort"
                  onClick={canSort ? column.getToggleSortingHandler() : undefined}
                  className={cn(
                    'flex items-center gap-1',
                    width,
                    headerAlignClass,
                    canSort && 'cursor-pointer select-none',
                    'transition-colors duration-200',
                  )}
                >
                  <span className="font-medium">{col.title}</span>
                  {col.helpContent && (
                    <CommonTooltip content={col.helpContent}>
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                    </CommonTooltip>
                  )}
                  {col.sorter && (
                    <div className="flex flex-col ml-1">
                      <ChevronUp
                        className={cn(
                          'h-3 w-3 transition-colors',
                          isSorted === 'asc' ? 'text-primary' : 'text-muted-foreground/50',
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          'h-3 w-3 transition-colors',
                          isSorted === 'desc' ? 'text-primary' : 'text-muted-foreground/50',
                        )}
                      />
                    </div>
                  )}
                </button>
              );
            },
            cell: ({ row, getValue }: { row: any; getValue: () => any }) => {
              if (!row || !getValue) return null;

              const value: any = getValue();
              const item = value as any;

              if (col.render) {
                return col.render(item, row.original, row.index);
              }

              return (
                <div
                  className={cn(
                    col.align ? `text-${col.align}` : 'text-left',
                    col.ellipsis && 'truncate',
                    col.bgColorClassName && `${col.bgColorClassName}`,
                    col.className,
                  )}
                >
                  {item && item.render ? item.render : item ? item.value : value}
                </div>
              );
            },
            enableSorting: !!col.sorter,
            meta: {
              ...col,
              fixed: col.fixed as FIXED,
              align: col.align as CanvasTextAlign,
              headerAlign: col.headerAlign as CanvasTextAlign,
              onCell: (record: DataSourceProps) => ({
                rowSpan: record.rowSpan,
                colSpan: record.colSpan,
              }),
            },
          };
          return columnDef;
        })
        .filter(Boolean) as CustomColumnDef<any>[];

      return columns;
    };

    const result: CustomColumnDef<any>[] = [];
    if (rowSelection) {
      result.push({
        id: 'selection',
        header: ({ table }) => {
          if (!table) return null;
          if (rowSelection.hideSelectAll) return null;
          return (
            <div className="flex justify-center">
              <Checkbox
                checked={
                  table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => {
                  table.toggleAllRowsSelected(!!value);
                  if (value) {
                    const selectedRows = dataSource;
                    const selectedKeys = selectedRows.map((row) => row[rowKey] as string | number);
                    rowSelection.onSelectAll?.(true, selectedRows);
                    rowSelection.onChange?.(selectedKeys, selectedRows);
                  } else {
                    rowSelection.onSelectNone?.();
                    rowSelection.onSelectAll?.(false, []);
                    rowSelection.onChange?.([], []);
                  }
                }}
                aria-label="Select all"
                className="transition-all duration-200"
              />
            </div>
          );
        },
        cell: ({ row }) => {
          if (!row) return null;

          const checkboxProps = rowSelection.getCheckboxProps
            ? rowSelection.getCheckboxProps(row.original)
            : {};
          return (
            <div className="flex justify-center">
              <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => {
                  row.toggleSelected(!!value);
                  const selectedRows = value
                    ? [...table.getSelectedRowModel().rows.map((r) => r.original)]
                    : table
                        .getSelectedRowModel()
                        .rows.filter((r) => r.id !== row.id)
                        .map((r) => r.original);
                  const selectedKeys = selectedRows.map((row) => row[rowKey] as string | number);
                  rowSelection.onSelect?.(row.original, !!value, selectedRows);
                  rowSelection.onChange?.(selectedKeys, selectedRows);
                }}
                aria-label="Select row"
                className="transition-all duration-200"
                {...checkboxProps}
              />
            </div>
          );
        },
        enableSorting: false,
        meta: { width: 40 },
      });
    }
    return [...result, ...transformColumns(columns)];
  }, [columns, rowSelection, dataSource, rowKey]);

  // Handle custom sorting
  const handleSorting = (updatedSorting: Updater<SortingState>) => {
    setSorting(updatedSorting);
    const newSorting =
      typeof updatedSorting === 'function' ? updatedSorting(sorting) : updatedSorting;
    if (newSorting.length > 0) {
      const { id, desc } = newSorting[0];
      const column = columns.find((col) => col.key === id);
      if (column && column.onSorterClick) {
        const sortOrder = desc ? SORT_ORDER.DESCEND : SORT_ORDER.ASCEND;
        setSortOrderState({ ...sortOrderState, [id]: sortOrder });
        column.onSorterClick({
          key: column.key,
          dataIndex: column.dataIndex,
          sortOrder,
        });
      }
    }
  };

  const table = useReactTable({
    data: dataSource,
    columns: tableColumns,
    state: { sorting, rowSelection: rowSelectedState },
    enableRowSelection: !!rowSelection,
    onRowSelectionChange: setRowSelectedState,
    onSortingChange: handleSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
    getRowId: (row) => row[rowKey] as string,
  });

  const handlePageChange = (page: number) => {
    if (pagination && typeof pagination !== 'boolean' && pagination.onChange) {
      pagination.onChange(page, pagination.pageSize || 10);
    }
  };

  if (loading) {
    const skeletonRowCount =
      (pagination && typeof pagination !== 'boolean' && pagination.pageSize) || loadingRowCount;

    return (
      <div className={cn('w-full', className)} {...rest}>
        <div
          className={cn(
            'rounded-md overflow-hidden',
            layoutBorder && 'border border-border shadow-sm',
            'transition-all duration-300',
          )}
        >
          <div className="w-full h-1 bg-muted overflow-hidden">
            <div className="h-full bg-primary/30 animate-progress"></div>
          </div>
          <div
            className={cn(
              'overflow-auto',
              scroll?.x && 'max-w-full',
              scroll?.y && `max-h-[${scroll.y}px]`,
            )}
            style={{
              maxWidth: scroll?.x
                ? typeof scroll.x === 'number'
                  ? `${scroll.x}px`
                  : scroll.x
                : undefined,
              maxHeight: scroll?.y
                ? typeof scroll.y === 'number'
                  ? `${scroll.y}px`
                  : scroll.y
                : undefined,
            }}
          >
            <Table
              containerClassName={tableContainerClassName}
              tableHeight={tableHeight}
              className={cn(
                bordered &&
                  'border-collapse [&_td]:border [&_td]:border-border [&_th]:border [&_th]:border-border',
                size === 'small' ? 'text-sm' : '',
                'w-full',
              )}
            >
              {showHeader && (
                <TableHeader
                  ref={headerRef}
                  className={cn('bg-white dark:bg-gray-900', 'sticky-top', 'table-header')}
                  style={{ top: 0 }}
                >
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-b border-border">
                      {headerGroup.headers.map((header) => {
                        const meta = header.column.columnDef.meta as TableV2Meta;
                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            style={{
                              width: meta?.width,
                              textAlign: meta?.headerAlign,
                            }}
                            className={cn(
                              size === 'small' ? 'h-8 px-2' : 'h-10 px-4',
                              'font-medium',
                              meta?.fixed === 'left' &&
                                'sticky left-0 z-10 bg-background shadow-[1px_0_0_0] shadow-border border-r border-border',
                              meta?.fixed === 'right' &&
                                'sticky right-0 z-10 bg-background shadow-[-1px_0_0_0] shadow-border border-l border-border',
                            )}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
              )}
              <TableBody>
                {Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className={cn(
                      'border-b border-border',
                      rowHover ? 'hover:bg-muted/10' : '',
                      'animate-in fade-in duration-300 ease-in-out',
                      rowIndex % 2 === 0 ? 'bg-muted/5' : '',
                    )}
                  >
                    {tableColumns.map((column, colIndex) => {
                      const meta = column.meta as TableV2Meta;
                      const isSelectionColumn = column.id === 'selection';

                      return (
                        <TableCell
                          key={colIndex}
                          className={cn(
                            size === 'small' ? 'p-2' : 'p-3',
                            meta?.align === 'center' && 'text-center',
                            meta?.align === 'right' && 'text-right',
                            meta?.fixed === 'left' &&
                              'sticky left-0 z-10 bg-background shadow-[1px_0_0_0] shadow-border border-r border-border',
                            meta?.fixed === 'right' &&
                              'sticky right-0 z-10 bg-background shadow-[-1px_0_0_0] shadow-border border-l border-border',
                          )}
                          style={{
                            width: meta?.width,
                            minWidth: meta?.width,
                          }}
                        >
                          {isSelectionColumn ? (
                            <div className="flex justify-center">
                              <div className="h-4 w-4 rounded-sm bg-muted animate-pulse" />
                            </div>
                          ) : (
                            <Skeleton
                              className={cn(
                                'h-5 rounded-md animate-pulse',
                                meta?.width ? 'w-full' : 'w-[85%]',
                                !meta?.width && rowIndex % 3 === 0 ? 'w-[75%]' : '',
                                !meta?.width && rowIndex % 3 === 1 ? 'w-[90%]' : '',
                              )}
                            />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {showPagination && pagination && typeof pagination !== 'boolean' && (
            <div
              className={cn(
                'flex mt-4',
                pagination.position === PAGINATION_POSITION.BOTTOM_LEFT
                  ? 'justify-start'
                  : 'justify-end',
              )}
            >
              <div className="flex gap-1 items-center">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (dataSource.length === 0) {
    return (
      <div className={cn('w-full', className)} {...rest}>
        <div
          className={cn(
            'rounded-md overflow-hidden',
            layoutBorder && 'border border-border shadow-sm',
            'transition-all duration-300',
          )}
        >
          <div
            className={cn(
              'overflow-auto',
              scroll?.x && 'max-w-full',
              scroll?.y && `max-h-[${scroll.y}px]`,
            )}
            style={{
              maxWidth: scroll?.x
                ? typeof scroll.x === 'number'
                  ? `${scroll.x}px`
                  : scroll.x
                : undefined,
              maxHeight: scroll?.y
                ? typeof scroll.y === 'number'
                  ? `${scroll.y}px`
                  : scroll.y
                : undefined,
            }}
          >
            <Table
              containerClassName={tableContainerClassName}
              tableHeight={tableHeight}
              className={cn(
                bordered &&
                  'border-collapse [&_td]:border [&_td]:border-border [&_th]:border [&_th]:border-border',
                size === 'small' ? 'text-sm' : '',
                'w-full',
              )}
            >
              {showHeader && (
                <TableHeader
                  ref={headerRef}
                  className={cn('bg-white dark:bg-gray-900', 'sticky-top', 'table-header')}
                  style={{ top: 0 }}
                >
                  <TableRow>
                    {tableColumns.map((column, index) => {
                      const meta = column.meta as TableV2Meta;
                      return (
                        <TableHead
                          key={index}
                          style={{
                            width: meta?.width,
                          }}
                          className={cn(
                            size === 'small' ? 'h-8 px-2' : 'h-10 px-4',
                            'text-muted-foreground font-medium',
                            meta?.align === 'center' && 'text-center',
                            meta?.align === 'right' && 'text-right',
                            meta?.fixed === 'left' &&
                              'sticky left-0 z-10 bg-muted/30 shadow-[1px_0_0_0] shadow-border border-r border-border',
                            meta?.fixed === 'right' &&
                              'sticky right-0 z-10 bg-muted/30 shadow-[-1px_0_0_0] shadow-border border-l border-border',
                          )}
                        >
                          {flexRender(column.header, {} as any)}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                </TableHeader>
              )}
              <TableBody>
                <TableRow>
                  <TableCell colSpan={tableColumns.length} className="p-0 border-none">
                    <div className="flex flex-col items-center justify-center py-16 px-4 animate-in fade-in duration-300">
                      <div className="relative mb-4 text-muted-foreground/50">
                        <ImgEmpty />
                      </div>
                      <div className="text-center space-y-1 max-w-md">
                        <p className="text-base font-medium text-foreground">
                          {typeof emptyText === 'string' ? 'No Data Available' : emptyText}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  const renderPagination = () => {
    if (!showPagination || !pagination || pagination === true || !paginationEnabled) {
      return null;
    }

    let paginationClassName = '';
    switch (pagination.position) {
      case PAGINATION_POSITION.TOP_LEFT:
        paginationClassName += 'justify-start mb-4';
        break;
      case PAGINATION_POSITION.TOP_RIGHT:
        paginationClassName += 'justify-end mb-4';
        break;
      case PAGINATION_POSITION.BOTTOM_LEFT:
        paginationClassName += 'justify-start';
        break;
      case PAGINATION_POSITION.BOTTOM_RIGHT:
        paginationClassName += 'justify-end';
        break;
    }

    return (
      <div className={cn('flex mt-4', paginationClassName)}>
        <PaginationV2
          currentPage={pagination.current || 1}
          totalPages={Math.ceil((pagination.total || 0) / (pagination.pageSize || 10))}
          onPageChange={handlePageChange}
        />
      </div>
    );
  };

  const isTopPagination =
    pagination &&
    typeof pagination !== 'boolean' &&
    (pagination.position === PAGINATION_POSITION.TOP_LEFT ||
      pagination.position === PAGINATION_POSITION.TOP_RIGHT);

  return (
    <div className={cn('w-full', className)} {...rest}>
      {isTopPagination && renderPagination()}
      <div
        ref={containerRef}
        className={cn(
          'rounded-md overflow-auto',
          layoutBorder && 'border border-border shadow-sm',
          scroll?.x && 'max-w-full',
          scroll?.y && `max-h-[${scroll.y}px]`,
          'transition-all duration-300',
        )}
        style={{
          height: tableHeight,
          maxWidth: scroll?.x
            ? typeof scroll.x === 'number'
              ? `${scroll.x}px`
              : scroll.x
            : undefined,
          maxHeight: scroll?.y
            ? typeof scroll.y === 'number'
              ? `${scroll.y}px`
              : scroll.y
            : undefined,
        }}
        id={idBody}
      >
        <Table
          ref={tableRef}
          containerClassName={tableContainerClassName}
          className={cn(
            bordered &&
              'border-collapse [&_td]:border [&_td]:border-border [&_th]:border [&_th]:border-border',
            size === 'small' && 'p-2',
            'w-full',
          )}
        >
          {showHeader && (
            <TableHeader
              ref={headerRef}
              className={cn('bg-white dark:bg-gray-900', 'sticky-top', 'table-header')}
              style={{ top: 0 }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: (header.column.columnDef.meta as TableV2Meta)?.width,
                      }}
                      className={cn(
                        `h-10 px-4 text-muted-foreground font-medium ${
                          (header.column.columnDef.meta as TableV2Meta)?.bgColorClassName
                        }`,
                        (header.column.columnDef.meta as TableV2Meta)?.headerAlign === 'center' &&
                          'text-center' &&
                          'justify-items-center',
                        (header.column.columnDef.meta as TableV2Meta)?.headerAlign === 'right' &&
                          'text-right' &&
                          'justify-items-end',
                        (header.column.columnDef.meta as TableV2Meta)?.fixed === 'left' &&
                          'sticky left-0 z-10 bg-background shadow-[1px_0_0_0] shadow-border border-r border-border',
                        (header.column.columnDef.meta as TableV2Meta)?.fixed === 'right' &&
                          'sticky right-0 z-10 bg-background shadow-[-1px_0_0_0] shadow-border border-l border-border',
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
          )}
          <TableBody>
            {dataSource.flatMap((parentRow, parentIndex, arr) => {
              const parentRowWithChildren = parentRow as DataSourceProps;
              const parentRowContext = createRowContext(parentRowWithChildren, -1, table);

              // Xác định index các hàng fixed top/bottom
              const fixedTopRows = arr.filter((r) => r.fixed === 'top');
              const fixedBottomRows = arr.filter((r) => r.fixed === 'bottom');
              const isLastFixedTop =
                parentRowWithChildren.fixed === 'top' &&
                fixedTopRows[fixedTopRows.length - 1]?.[rowKey] === parentRowWithChildren[rowKey];
              const isFirstFixedBottom =
                parentRowWithChildren.fixed === 'bottom' &&
                fixedBottomRows[0]?.[rowKey] === parentRowWithChildren[rowKey];

              const parentElement = (
                <TableRow
                  key={parentRowWithChildren[rowKey] as string}
                  ref={(el) => {
                    // Gán ref cho row fixed top
                    if (parentRowWithChildren.fixed === 'top') {
                      rowRefs.current[parentRowWithChildren[rowKey] as string | number] = el;
                    }
                  }}
                  className={cn(
                    'border-b border-border transition-colors bg-muted/10',
                    rowHover && 'hover:bg-muted/20',
                    rowCursor && 'cursor-pointer',
                    parentRowWithChildren.fixed === 'top' &&
                      'sticky-top bg-white dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-900',
                    parentRowWithChildren.fixed === 'bottom' &&
                      'sticky-bottom bg-white dark:bg-gray-900 hover:bg-white dark:hover:bg-gray-900',
                    isLastFixedTop && 'fixed-top-shadow-bottom',
                    isFirstFixedBottom && 'fixed-bottom-shadow-top',
                  )}
                  style={{
                    ...(parentRowWithChildren.fixed === 'top'
                      ? { top: stickyTopOffsets[parentRowWithChildren[rowKey] as string | number] }
                      : {}),
                  }}
                  onClick={() =>
                    onRowClick?.({
                      ...parentRowWithChildren,
                      isParent: true,
                    })
                  }
                >
                  {table.getHeaderGroups()[0].headers.map((header) => {
                    const columnMeta = header.column.columnDef.meta as TableV2Meta;
                    const cellValue = parentRowWithChildren[header.column.id];

                    const cellContext = {
                      getValue: () => cellValue,
                      row: parentRowContext,
                      column: header.column,
                      cell: {
                        id: `${parentRowWithChildren[rowKey]}-${header.id}`,
                        getValue: () => cellValue,
                        renderValue: () => cellValue,
                        row: parentRowContext,
                        column: header.column,
                      } as Cell<any, unknown>,
                    };

                    const cellProps = columnMeta?.onCell?.(parentRowWithChildren, -1) || {};

                    return (
                      <TableCell
                        key={`${parentRowWithChildren[rowKey]}-${header.id}`}
                        colSpan={cellProps.colSpan}
                        rowSpan={cellProps.rowSpan}
                        className={cn(
                          columnMeta?.className,
                          columnMeta?.bgColorClassName,
                          columnMeta?.align === 'center' && 'text-center',
                          columnMeta?.align === 'right' && 'text-right',
                          columnMeta?.fixed === 'left' &&
                            'sticky left-0 z-30 bg-background shadow-[1px_0_0_0] shadow-border border-r border-border',
                          columnMeta?.fixed === 'right' &&
                            'sticky right-0 z-30 bg-background shadow-[-1px_0_0_0] shadow-border border-l border-border',
                        )}
                        style={{
                          width: columnMeta?.width,
                          minWidth: columnMeta?.width,
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.cell,
                          cellContext as CellContext<any, unknown>,
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );

              const childElements =
                parentRowWithChildren.children?.map((child, childIndex) => {
                  const childRowContext = createRowContext(child, childIndex, table);

                  return (
                    <TableRow
                      key={`${parentRowWithChildren[rowKey]}-child-${childIndex}`}
                      className={cn(
                        'border-b border-border transition-colors',
                        rowHover && 'hover:bg-muted/10',
                        rowCursor && 'cursor-pointer',
                        child.fixed === 'top' && 'sticky top-0 z-20 bg-white dark:bg-gray-900',
                        child.fixed === 'bottom' &&
                          'sticky bottom-0 z-20 bg-white dark:bg-gray-900',
                      )}
                      onClick={() =>
                        onRowClick?.({
                          ...child,
                          parent: parentRowWithChildren,
                          isChild: true,
                        })
                      }
                    >
                      {table.getHeaderGroups()[0].headers.map((header) => {
                        const columnMeta = header.column.columnDef.meta as TableV2Meta;
                        const cellValue = child[header.column.id];

                        const cellContext = {
                          getValue: () => cellValue,
                          row: childRowContext,
                          column: header.column,
                          cell: {
                            id: `${child[rowKey]}-${header.id}`,
                            getValue: () => cellValue,
                            renderValue: () => cellValue,
                            row: childRowContext,
                            column: header.column,
                          } as Cell<any, unknown>,
                        };

                        const cellProps = columnMeta?.onCell?.(child, childIndex) || {};

                        return (
                          <TableCell
                            key={`${child[rowKey]}-${header.id}`}
                            colSpan={cellProps.colSpan}
                            rowSpan={cellProps.rowSpan}
                            className={cn(
                              columnMeta?.className,
                              columnMeta?.align === 'center' && 'text-center',
                              columnMeta?.align === 'right' && 'text-right',
                              columnMeta?.bgColorClassName,
                              columnMeta?.fixed === 'left' &&
                                'sticky left-0 z-30 bg-background shadow-[1px_0_0_0] shadow-border border-r border-border',
                              columnMeta?.fixed === 'right' &&
                                'sticky right-0 z-30 bg-background shadow-[-1px_0_0_0] shadow-border border-l border-border',
                              'text-gray-700 dark:text-gray-300',
                            )}
                            style={{
                              width: columnMeta?.width,
                              minWidth: columnMeta?.width,
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.cell,
                              cellContext as CellContext<any, unknown>,
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                }) || [];

              return [parentElement, ...childElements];
            })}
          </TableBody>
        </Table>
      </div>
      {!isTopPagination && renderPagination()}
    </div>
  );
}
