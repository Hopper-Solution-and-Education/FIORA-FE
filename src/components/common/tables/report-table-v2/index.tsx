'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Updater,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Pagination } from '@/components/ui/pagination';
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import {
  type ColumnProps,
  PAGINATION_POSITION,
  SORT_ORDER,
  type SortOrderStateProps,
  type TableProps,
} from './types';
import { cn } from '@/shared/utils';

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
  showPagination = true, // Added default
  paginationEnabled = true, // Added default
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
    const transformColumns = (cols: ColumnProps[]): ColumnDef<any>[] => {
      return cols.map((col) => {
        if (col.children) {
          return {
            id: col.key,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            header: ({ column }) => col.title || col.key,
            columns: transformColumns(col.children),
          };
        } else {
          return {
            id: col.key,
            accessorKey: col.dataIndex,
            header: ({ column }) => {
              const isSorted = column.getIsSorted();
              const canSort = column.getCanSort();

              return (
                <button
                  onClick={canSort ? column.getToggleSortingHandler() : undefined}
                  className={cn(
                    'flex items-center gap-1 w-full',
                    col.headerAlign ? `justify-${col.headerAlign}` : 'justify-start',
                    canSort && 'cursor-pointer select-none',
                  )}
                >
                  {col.title}
                  {col.helpContent && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>{col.helpContent}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                  {col.sorter && (
                    <div className="flex flex-col ml-1">
                      <ChevronUp
                        className={cn(
                          'h-3 w-3',
                          isSorted === 'asc' ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                      <ChevronDown
                        className={cn(
                          'h-3 w-3',
                          isSorted === 'desc' ? 'text-primary' : 'text-muted-foreground',
                        )}
                      />
                    </div>
                  )}
                </button>
              );
            },
            cell: ({ row, getValue }) => {
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
      });
    };

    // Add selection column if rowSelection is provided
    const result: ColumnDef<any>[] = [];
    if (rowSelection) {
      result.push({
        id: 'selection',
        header: ({ table }) => {
          if (rowSelection.hideSelectAll) return null;
          return (
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
            />
          );
        },
        cell: ({ row }) => {
          const checkboxProps = rowSelection.getCheckboxProps
            ? rowSelection.getCheckboxProps(row.original)
            : {};
          return (
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
              {...checkboxProps}
            />
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
        <div className={cn('rounded-md', layoutBorder && 'border')}>
          <ShadcnTable className={cn(bordered && 'border-collapse [&_td]:border [&_th]:border')}>
            {showHeader && (
              <TableHeader>
                <TableRow>
                  {tableColumns.map((column, index) => (
                    <TableHead key={index} style={{ width: (column.meta as any)?.width }}>
                      <Skeleton className="h-6 w-full" />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {Array.from({ length: 5 }).map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {tableColumns.map((column, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-6 w-full" />
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
        <div className={cn('rounded-md', layoutBorder && 'border')}>
          <ShadcnTable className={cn(bordered && 'border-collapse [&_td]:border [&_th]:border')}>
            {showHeader && (
              <TableHeader>
                <TableRow>
                  {tableColumns.map((column, index) => (
                    <TableHead
                      key={index}
                      style={{ width: (column.meta as any)?.width }}
                      className={cn(
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
                <TableCell colSpan={tableColumns.length} className="text-center py-6">
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
    return (
      <div
        className={cn(
          'flex mt-4',
          pagination.position === PAGINATION_POSITION.BOTTOM_RIGHT && 'justify-end',
          pagination.position === PAGINATION_POSITION.BOTTOM_LEFT && 'justify-start',
          pagination.position === PAGINATION_POSITION.TOP_RIGHT && 'justify-end mb-4',
          pagination.position === PAGINATION_POSITION.TOP_LEFT && 'justify-start mb-4',
        )}
      >
        <Pagination
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
          layoutBorder && 'border',
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
        id={idBody}
      >
        <ShadcnTable
          className={cn(
            bordered && 'border-collapse [&_td]:border [&_th]:border',
            size === 'small' && 'p-2',
          )}
        >
          {showHeader && (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{ width: (header.column.columnDef.meta as any)?.width }}
                      className={cn(
                        (header.column.columnDef.meta as any)?.align === 'center' && 'text-center',
                        (header.column.columnDef.meta as any)?.align === 'right' && 'text-right',
                        (header.column.columnDef.meta as any)?.fixed === 'left' &&
                          'sticky left-0 z-10 bg-background',
                        (header.column.columnDef.meta as any)?.fixed === 'right' &&
                          'sticky right-0 z-10 bg-background',
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
                className={cn(rowHover && 'hover:bg-muted/50', rowCursor && 'cursor-pointer')}
                onClick={() => onRowClick && onRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => {
                  const cellProps =
                    (cell.column.columnDef.meta as any)?.onCell?.(row.original, row.index) || {};
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        (cell.column.columnDef.meta as any)?.className,
                        (cell.column.columnDef.meta as any)?.align === 'center' && 'text-center',
                        (cell.column.columnDef.meta as any)?.align === 'right' && 'text-right',
                        (cell.column.columnDef.meta as any)?.ellipsis && 'max-w-[200px] truncate',
                        (cell.column.columnDef.meta as any)?.fixed === 'left' &&
                          'sticky left-0 z-10 bg-background',
                        (cell.column.columnDef.meta as any)?.fixed === 'right' &&
                          'sticky right-0 z-10 bg-background',
                      )}
                      colSpan={cellProps.colSpan || (cell.column.columnDef.meta as any)?.colSpan}
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
