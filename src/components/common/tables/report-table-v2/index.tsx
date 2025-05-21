'use client';

import { CustomPagination } from '@/components/common/atoms/CustomPagination';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Updater,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Column,
  type Cell,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  type CustomColumnDef,
  type CustomColumnMeta,
  PAGINATION_POSITION,
  SORT_ORDER,
  type ColumnProps,
  type SortOrderStateProps,
  type TableProps,
} from './types';

export function CustomTable({
  columns = [],
  dataSource = [],
  bordered = false,
  layoutBorder = false,
  showHeader = true,
  scroll,
  rowSelection,
  rowKey = 'key',
  loading = false,
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
  ...rest
}: TableProps) {
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

  // Transform columns to TanStack format
  const tableColumns = useMemo(() => {
    const transformColumns = (cols: ColumnProps[]): CustomColumnDef<any>[] => {
      const columns = cols
        .map((col: ColumnProps) => {
          if (!col) return null;

          if (col.children) {
            return {
              id: col.key,
              header: (col: ColumnProps) => col.title || col.key,
              columns: transformColumns(col.children),
            };
          } else {
            return {
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs text-sm">
                            {col.helpContent}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                if (col.render) {
                  return col.render(value, row.original, row.index);
                }
                return (
                  <div
                    className={cn(
                      col.align ? `text-${col.align}` : 'text-left',
                      col.ellipsis && 'truncate',
                      col.className,
                    )}
                  >
                    {value}
                  </div>
                );
              },
              enableSorting: !!col.sorter,
              meta: {
                align: col.align,
                width: col.width,
                fixed: col.fixed,
                className: col.className,
                ellipsis: col.ellipsis,
                colSpan: col.colSpan,
                onCell: col.onCell,
              },
            };
          }
        })
        .filter(Boolean);

      return columns as unknown as ColumnDef<any>[];
    };

    // Add selection column if rowSelection is provided
    const result: ColumnDef<any>[] = [];
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
        column.onSorterClick({ key: column.key, dataIndex: column.dataIndex, sortOrder });
      }
    }
  };

  // Initialize table with custom row IDs
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
    getRowId: (row) => row[rowKey] as string, // Use custom row keys
  });

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (pagination && typeof pagination !== 'boolean' && pagination.onChange) {
      pagination.onChange(page, pagination.pageSize || 10);
    }
  };

  // Render loading skeleton
  if (loading) {
    return (
      <div className={cn('w-full', className)} {...rest}>
        <div
          className={cn(
            'rounded-md overflow-hidden',
            layoutBorder && 'border border-border shadow-sm',
            'transition-all duration-300',
          )}
        >
          <ShadcnTable
            className={cn(
              bordered &&
                'border-collapse [&_td]:border [&_td]:border-border [&_th]:border [&_th]:border-border',
              'w-full',
            )}
          >
            {showHeader && (
              <TableHeader className="bg-muted/30">
                <TableRow>
                  {tableColumns.map((column, index) => (
                    <TableHead
                      key={index}
                      style={{ width: (column.meta as any)?.width }}
                      className="h-10 px-4 text-muted-foreground"
                    >
                      <Skeleton className="h-5 w-full rounded-md" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-b border-border">
                  {tableColumns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="p-3">
                      <Skeleton className="h-5 w-full rounded-md" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </ShadcnTable>
        </div>
      </div>
    );
  }

  // Render empty state
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
          <ShadcnTable
            className={cn(
              bordered &&
                'border-collapse [&_td]:border [&_td]:border-border [&_th]:border [&_th]:border-border',
              'w-full',
            )}
          >
            {showHeader && (
              <TableHeader className="bg-muted/30">
                <TableRow>
                  {tableColumns.map((column, index) => (
                    <TableHead
                      key={index}
                      style={{ width: (column.meta as any)?.width }}
                      className={cn(
                        'h-10 px-4 text-muted-foreground font-medium',
                        (column.meta as any)?.align === 'center' && 'text-center',
                        (column.meta as any)?.align === 'right' && 'text-right',
                      )}
                    >
                      {flexRender(column.header, {} as any)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="text-center py-12 text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            </TableBody>
          </ShadcnTable>
        </div>
      </div>
    );
  }

  // Render pagination
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
        <CustomPagination
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
        className={cn(
          'rounded-md overflow-auto',
          layoutBorder && 'border border-border shadow-sm',
          scroll?.x && 'max-w-full',
          scroll?.y && `max-h-[${scroll.y}px]`,
          'transition-all duration-300',
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
        id={idBody}
      >
        <ShadcnTable
          className={cn(
            bordered &&
              'border-collapse [&_td]:border [&_td]:border-border [&_th]:border [&_th]:border-border',
            size === 'small' && 'p-2',
            'w-full',
          )}
        >
          {showHeader && (
            <TableHeader className="bg-muted/30">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: (header.column.columnDef.meta as any)?.width }}
                      className={cn(
                        'h-10 px-4 text-muted-foreground font-medium',
                        (header.column.columnDef.meta as any)?.align === 'center' && 'text-center',
                        (header.column.columnDef.meta as any)?.align === 'right' && 'text-right',
                        (header.column.columnDef.meta as any)?.fixed === 'left' &&
                          'sticky left-0 z-10 bg-background shadow-[1px_0_0_0] shadow-border',
                        (header.column.columnDef.meta as any)?.fixed === 'right' &&
                          'sticky right-0 z-10 bg-background shadow-[-1px_0_0_0] shadow-border',
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
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cn(
                  'border-b border-border transition-colors',
                  rowHover && 'hover:bg-muted/50',
                  rowCursor && 'cursor-pointer',
                  row.getIsSelected() && 'bg-primary/5 hover:bg-primary/10',
                )}
                onClick={() => onRowClick && onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell: Cell<any, any>) => {
                  const cellProps =
                    (cell.column.columnDef.meta as CustomColumnMeta)?.onCell?.(
                      row.original,
                      row.index,
                    ) || {};
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        (cell.column.columnDef.meta as CustomColumnMeta)?.className,
                        (cell.column.columnDef.meta as CustomColumnMeta)?.align === 'center' &&
                          'text-center',
                        (cell.column.columnDef.meta as CustomColumnMeta)?.align === 'right' &&
                          'text-right',
                        (cell.column.columnDef.meta as CustomColumnMeta)?.ellipsis &&
                          'max-w-[200px] truncate',
                        (cell.column.columnDef.meta as CustomColumnMeta)?.fixed === 'left' &&
                          'sticky left-0 z-10 bg-background shadow-[1px_0_0_0] shadow-border',
                        (cell.column.columnDef.meta as CustomColumnMeta)?.fixed === 'right' &&
                          'sticky right-0 z-10 bg-background shadow-[-1px_0_0_0] shadow-border',
                      )}
                      colSpan={
                        cellProps.colSpan ||
                        (cell.column.columnDef.meta as CustomColumnMeta)?.colSpan
                      }
                      rowSpan={cellProps.rowSpan}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </ShadcnTable>
      </div>
      {!isTopPagination && renderPagination()}
    </div>
  );
}
