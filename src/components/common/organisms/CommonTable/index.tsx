import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/shared/utils';
import { useEffect, useMemo } from 'react';
import CommonColumnMenu from './components/CommonColumnMenu';
import CommonTableLoadingState from './components/CommonTableLoadingState';
import { useCommonInfiniteScroll } from './hook';
import { ColumnConfigMap, CommonTableProps } from './types';
import { getAlignClass, loadColumnConfigFromStorage, saveColumnConfigToStorage } from './utils';

export default function CommonTable<T>({
  data,
  columns,
  columnConfig,
  storageKey,
  loading = false,
  hasMore = false,
  isLoadingMore = false,
  rightHeaderNode,
  leftHeaderNode,
  emptyState,
  skeletonRows,
  loadingMoreRows = 3,
  className,
  onColumnConfigChange,
  onLoadMore,
  columnConfigMenuProps,
  ...props
}: CommonTableProps<T>) {
  const { containerRef } = useCommonInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore,
    isLoadingMore,
  });

  const shownColumns = useMemo(() => {
    // Merge runtime columns with config to ensure every column has a config entry
    const mergedConfig: ColumnConfigMap = columns.reduce((acc, c, idx) => {
      const existing = columnConfig[c.key];
      acc[c.key] = existing ?? { isVisible: true, index: idx, alignOverride: c.align };
      return acc;
    }, {} as ColumnConfigMap);

    const visibleColumns = columns
      .filter((c) => mergedConfig[c.key]?.isVisible !== false)
      .sort((a, b) => {
        const aIndex = mergedConfig[a.key]?.index ?? 0;
        const bIndex = mergedConfig[b.key]?.index ?? 0;
        return aIndex - bIndex;
      });

    // Auto-calculate column widths if not specified
    const columnsWithWidth = visibleColumns.filter((col) => col.width);
    const columnsWithoutWidth = visibleColumns.filter((col) => !col.width);

    if (columnsWithoutWidth.length > 0) {
      // Calculate remaining percentage for columns without width
      const usedPercentage = columnsWithWidth.reduce((sum, col) => {
        const width = col.width || '';
        const widthStr = typeof width === 'string' ? width : String(width);
        const percentage = parseFloat(widthStr.replace('%', ''));

        return sum + (isNaN(percentage) ? 0 : percentage);
      }, 0);

      const remainingPercentage = Math.max(0, 100 - usedPercentage);
      const autoWidth = `${(remainingPercentage / columnsWithoutWidth.length).toFixed(1)}%`;

      return visibleColumns.map((col) => ({
        ...col,
        width: col.width || autoWidth,
      }));
    }

    return visibleColumns;
  }, [columns, columnConfig]);

  const handleConfigChange = (cfg: ColumnConfigMap) => {
    // Normalize config to include all current columns and drop stale ones
    const normalized: ColumnConfigMap = columns.reduce((acc, c, idx) => {
      const entry = cfg[c.key] ?? { isVisible: true, index: idx, alignOverride: c.align };
      // keep align from column if not explicitly set
      acc[c.key] = { ...entry, alignOverride: entry.alignOverride ?? c.align };

      return acc;
    }, {} as ColumnConfigMap);

    onColumnConfigChange?.(normalized);
    saveColumnConfigToStorage(storageKey, normalized);
  };

  // initial load from storage (merge with defaults to protect against schema drift)
  useEffect(() => {
    const loaded = loadColumnConfigFromStorage(storageKey);
    if (loaded && onColumnConfigChange) {
      const merged = columns.reduce((acc, c, idx) => {
        const entry = loaded[c.key] ?? { isVisible: true, index: idx, alignOverride: c.align };
        acc[c.key] = { ...entry, alignOverride: entry.alignOverride ?? c.align };

        return acc;
      }, {} as ColumnConfigMap);
      onColumnConfigChange(merged);
    } else if (storageKey && onColumnConfigChange) {
      // persist current config as default
      saveColumnConfigToStorage(storageKey, columnConfig);
    }
  }, [storageKey]);

  const renderHeader = () => (
    <div className="flex items-center justify-between">
      {leftHeaderNode && <div className="text-sm text-muted-foreground">{leftHeaderNode}</div>}

      <div className="flex items-center gap-2 ml-auto">
        {rightHeaderNode}

        {onColumnConfigChange && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-md hover:bg-accent hover:text-accent-foreground px-5 transition-colors"
                aria-label="Column settings"
                data-test="common-table-column-menu-trigger"
              >
                <Icons.slidersHorizontal className="w-5 h-5" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-max" align="end" sideOffset={8}>
              <CommonColumnMenu
                columns={columns}
                config={columnConfig}
                onColumnChange={handleConfigChange}
                onColumnReset={() =>
                  handleConfigChange(
                    columns.reduce((acc, c, idx) => {
                      acc[c.key] = { isVisible: true, index: idx, alignOverride: c.align };
                      return acc;
                    }, {} as ColumnConfigMap),
                  )
                }
                {...columnConfigMenuProps}
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );

  return (
    <div className={`common-table space-y-4 ${className || ''}`} {...props}>
      {renderHeader()}

      <div
        ref={(el) => {
          containerRef.current = el;
        }}
        className="common-table-wrapper rounded-md border max-h-[600px] min-w-[400px] overflow-auto relative"
        style={{ minHeight: '400px' }}
      >
        <Table className="min-w-[400px] table-fixed w-full">
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              {shownColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`${getAlignClass(columnConfig[col.key]?.alignOverride ?? col.align)} truncate p-3 ${col.headClassName || ''}`}
                  style={{ width: col.width }}
                >
                  {col.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading || (data && data.length === 0) ? (
              emptyState ? (
                emptyState
              ) : (
                <CommonTableLoadingState
                  loading={loading}
                  isLoadingMore={isLoadingMore}
                  dataLength={data?.length || 0}
                  hasMore={hasMore}
                  columns={shownColumns}
                  skeletonRows={skeletonRows}
                  loadingMoreRows={loadingMoreRows}
                />
              )
            ) : data && data.length > 0 ? (
              <>
                {data.map((item, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {shownColumns.map((col) => (
                      <TableCell
                        key={`${col.key}-${rowIdx}`}
                        className="p-0"
                        style={{ width: col.width }}
                      >
                        <div
                          className={cn(
                            'flex p-3 overflow-hidden text-ellipsis',
                            getAlignClass(columnConfig[col.key]?.alignOverride ?? col.align),
                          )}
                        >
                          {col.render ? col.render(item) : (item as any)[col.key]}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

                {isLoadingMore && (
                  <>
                    {Array.from({ length: loadingMoreRows }).map((_, idx) => (
                      <CommonTableLoadingState
                        key={`lm-${idx}`}
                        loading={false}
                        isLoadingMore={true}
                        dataLength={data.length}
                        hasMore={true}
                        columns={shownColumns}
                        loadingMoreRows={1}
                      />
                    ))}
                  </>
                )}

                {(hasMore || isLoadingMore) && (
                  <TableRow>
                    <TableCell colSpan={shownColumns.length}>
                      <div
                        style={{ height: '20px', backgroundColor: 'transparent' }}
                        data-testid="infinite-scroll-sentinel"
                      />
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
