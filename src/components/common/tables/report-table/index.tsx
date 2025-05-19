'use client';

import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';

import {
  type TableProps,
  type ColumnProps,
  type DataSourceProps,
  type SortOrderProps,
  PAGINATION_POSITION,
} from './type';
import { cn } from '@/shared/utils';
import { PaginationV2 } from '@/components/ui/paginationV2';

export function ReportTable({
  columns = [],
  dataSource = [],
  bordered = false,
  layoutBorder = true,
  showHeader = true,
  scroll,
  rowSelection,
  rowKey = 'key',
  loading = false,
  pagination = null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  size = 'middle',
  emptyText = 'No data',
  rowHover = true,
  rowCursor = false,
  onRowClick,
  idBody,
  isResetSelection = false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  indexSelected,
  showPagination = true,
  paginationEnabled = true,
  className,
  position = PAGINATION_POSITION.BOTTOM_RIGHT,
  ...rest
}: TableProps) {
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const [sortState, setSortState] = useState<Record<string, SortOrderProps>>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Reset selection when isResetSelection changes
  useEffect(() => {
    if (isResetSelection) {
      setSelectedRowKeys([]);
    }
  }, [isResetSelection]);

  // Handle sort click
  const handleSortClick = async (column: ColumnProps) => {
    if (!column.sorter) return;

    const key = column.key;
    let newSortOrder: SortOrderProps = null;

    if (!sortState[key]) {
      newSortOrder = 'ascend';
    } else if (sortState[key] === 'ascend') {
      newSortOrder = 'descend';
    } else {
      newSortOrder = null;
    }

    const newSortState = { ...sortState, [key]: newSortOrder };
    setSortState(newSortState);

    if (column.onSorterClick) {
      await column.onSorterClick({
        key: column.key,
        dataIndex: column.dataIndex,
        sortOrder: newSortOrder,
      });
    }
  };

  // Handle row selection
  const handleSelectRow = (record: DataSourceProps, selected: boolean) => {
    const key = record[rowKey] as string | number;
    let newSelectedRowKeys = [...selectedRowKeys];

    if (selected) {
      if (!newSelectedRowKeys.includes(key)) {
        newSelectedRowKeys.push(key);
      }
    } else {
      newSelectedRowKeys = newSelectedRowKeys.filter((k) => k !== key);
    }

    setSelectedRowKeys(newSelectedRowKeys);

    if (rowSelection?.onChange) {
      const selectedRows = dataSource.filter((item) =>
        newSelectedRowKeys.includes(item[rowKey] as string | number),
      );
      rowSelection.onChange(newSelectedRowKeys, selectedRows);
    }

    if (rowSelection?.onSelect) {
      const selectedRows = dataSource.filter((item) =>
        newSelectedRowKeys.includes(item[rowKey] as string | number),
      );
      rowSelection.onSelect(record, selected, selectedRows);
    }
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    let newSelectedRowKeys: (string | number)[] = [];

    if (selected) {
      newSelectedRowKeys = dataSource.map((record) => record[rowKey] as string | number);
    }

    setSelectedRowKeys(newSelectedRowKeys);

    if (rowSelection?.onChange) {
      const selectedRows = dataSource.filter((item) =>
        newSelectedRowKeys.includes(item[rowKey] as string | number),
      );
      rowSelection.onChange(newSelectedRowKeys, selectedRows);
    }

    if (rowSelection?.onSelectAll) {
      const selectedRows = dataSource.filter((item) =>
        newSelectedRowKeys.includes(item[rowKey] as string | number),
      );
      rowSelection.onSelectAll(selected, selectedRows);
    }
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof pagination === 'object' && pagination?.onChange) {
      pagination.onChange(page, pageSize);
    }
  };

  // Get paginated data
  const paginatedData = useMemo(() => {
    if (!pagination || typeof pagination === 'boolean' || !paginationEnabled) {
      return dataSource;
    }

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return dataSource.slice(start, end);
  }, [dataSource, currentPage, pageSize, pagination, paginationEnabled]);

  // Sort data if needed
  const sortedData = useMemo(() => {
    const result = [...paginatedData];

    // Apply sorting
    Object.entries(sortState).forEach(([key, order]) => {
      if (!order) return;

      const column = columns.find((col) => col.key === key);
      if (!column || !column.sorter) return;

      result.sort((a, b) => {
        const sorter = typeof column.sorter === 'function' ? column.sorter : null;
        if (sorter) {
          const result = sorter(a, b);
          return order === 'ascend' ? result : -result;
        }
        return 0;
      });
    });

    return result;
  }, [paginatedData, sortState, columns]);

  // Render header cell
  const renderHeaderCell = (column: ColumnProps) => {
    const { title, key, align = 'left', headerAlign, sorter, helpContent } = column;
    const sortOrder = sortState[key];

    return (
      <th
        key={key}
        className={cn(
          'px-4 py-3 text-sm font-medium text-gray-700',
          headerAlign ? `text-${headerAlign}` : align ? `text-${align}` : 'text-left',
          column.className,
        )}
        style={{ width: column.width }}
      >
        <div className="flex items-center gap-1">
          <div className="flex-1">{title}</div>
          {sorter && (
            <button
              onClick={() => handleSortClick(column)}
              className="ml-1 inline-flex items-center"
              aria-label={`Sort by ${String(title)}`}
            >
              <div className="flex flex-col">
                <ChevronUp
                  className={cn('h-3 w-3 text-gray-400', sortOrder === 'ascend' && 'text-gray-900')}
                />
                <ChevronDown
                  className={cn(
                    'h-3 w-3 text-gray-400',
                    sortOrder === 'descend' && 'text-gray-900',
                  )}
                />
              </div>
            </button>
          )}
          {helpContent && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{helpContent}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </th>
    );
  };

  // Render cell content
  const renderCell = (record: DataSourceProps, column: ColumnProps, index: number) => {
    const { dataIndex, render, align = 'left' } = column;
    const value = dataIndex ? record[dataIndex] : null;

    // Handle cell span
    let cellProps = {};
    if (column.onCell) {
      cellProps = column.onCell(record, index) || {};
    }

    return (
      <td
        key={column.key}
        className={cn(
          'px-4 py-3 text-sm',
          align ? `text-${align}` : 'text-left',
          column.ellipsis && 'truncate',
          column.className,
        )}
        style={{ width: column.width }}
        {...cellProps}
      >
        {render ? render(value, record, index) : (value as React.ReactNode)}
      </td>
    );
  };

  // Render table header
  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <thead className={cn('bg-gray-50', bordered && 'border-b border-gray-200')}>
        <tr>
          {rowSelection && !rowSelection.hideSelectAll && (
            <th className="w-10 px-4 py-3">
              <Checkbox
                checked={dataSource.length > 0 && selectedRowKeys.length === dataSource.length}
                onCheckedChange={(checked) => handleSelectAll(!!checked)}
                aria-label="Select all rows"
              />
            </th>
          )}
          {columns.map(renderHeaderCell)}
        </tr>
      </thead>
    );
  };

  // Render table body
  const renderBody = () => {
    if (loading) {
      return (
        <tbody>
          {Array.from({ length: 5 }).map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              {rowSelection && (
                <td className="w-10 px-4 py-3">
                  <Skeleton className="h-4 w-4" />
                </td>
              )}
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      );
    }

    if (sortedData.length === 0) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={rowSelection ? columns.length + 1 : columns.length}
              className="px-4 py-8 text-center text-gray-500"
            >
              {emptyText}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody id={idBody}>
        {sortedData.map((record, index) => {
          const key = record[rowKey] as string | number;
          const isSelected = selectedRowKeys.includes(key);

          return (
            <tr
              key={key}
              className={cn(
                'border-b border-gray-200',
                rowHover && 'hover:bg-gray-50',
                rowCursor && 'cursor-pointer',
                isSelected && 'bg-blue-50',
              )}
              onClick={() => onRowClick && onRowClick(record)}
            >
              {rowSelection && (
                <td className="w-10 px-4 py-3">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => handleSelectRow(record, !!checked)}
                    aria-label={`Select row ${index + 1}`}
                    {...(rowSelection.getCheckboxProps
                      ? rowSelection.getCheckboxProps(record)
                      : {})}
                  />
                </td>
              )}
              {columns.map((column) => renderCell(record, column, index))}
            </tr>
          );
        })}
      </tbody>
    );
  };

  // Render pagination
  const renderPagination = () => {
    if (!pagination || typeof pagination === 'boolean' || !showPagination || !paginationEnabled) {
      return null;
    }

    const total =
      typeof pagination === 'object' ? pagination.total || dataSource.length : dataSource.length;
    const currentPageSize = typeof pagination === 'object' ? pagination.pageSize || 10 : 10;

    const paginationComponent = (
      <PaginationV2
        className="mt-4"
        {...(typeof pagination === 'object' ? pagination : {})}
        count={total}
        page={currentPage}
        pageSize={currentPageSize}
        onPageChange={handlePageChange}
      />
    );

    if (position.includes('top')) {
      return (
        <div className={cn('mb-4 flex', position === 'topLeft' ? 'justify-start' : 'justify-end')}>
          {paginationComponent}
        </div>
      );
    }

    return (
      <div className={cn('mt-4 flex', position === 'bottomLeft' ? 'justify-start' : 'justify-end')}>
        {paginationComponent}
      </div>
    );
  };

  useEffect(() => {
    setPageSize(typeof pagination === 'object' ? pagination?.pageSize || 10 : 10);
  }, [pagination]);

  return (
    <div className={cn('w-full', className)} {...rest}>
      {position.includes('top') && renderPagination()}
      <div
        className={cn('w-full overflow-auto', layoutBorder && 'rounded-lg border border-gray-200')}
        style={{
          maxHeight: scroll?.y ? `${scroll.y}px` : undefined,
          maxWidth: scroll?.x ? `${scroll.x}px` : undefined,
        }}
      >
        <table className="w-full border-collapse">
          {renderHeader()}
          {renderBody()}
        </table>
      </div>
      {position.includes('bottom') && renderPagination()}
    </div>
  );
}
