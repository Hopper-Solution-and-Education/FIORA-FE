import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCommonInfiniteScroll } from '@/shared/hooks/useCommonInfiniteScroll';
import { useEffect, useMemo } from 'react';
import CommonColumnMenu from './components/CommonColumnMenu';
import CommonTableLoadingState from './components/CommonTableLoadingState';
import { ColumnConfigMap, CommonTableProps } from './types';
import { loadColumnConfigFromStorage, saveColumnConfigToStorage } from './utils';

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
}: CommonTableProps<T>) {
  const { containerRef, sentinelRef } = useCommonInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore,
    isLoadingMore,
  });

  const shownColumns = useMemo(() => {
    // Merge runtime columns with config to ensure every column has a config entry
    const mergedConfig: ColumnConfigMap = columns.reduce((acc, c, idx) => {
      const existing = columnConfig[c.key];
      acc[c.key] = existing ?? { isVisible: true, index: idx, align: c.align };
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
    const totalVisibleColumns = visibleColumns.length;
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

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'left') return 'text-left';
    if (align === 'right') return 'text-right';
    return 'text-center';
  };

  const handleConfigChange = (cfg: ColumnConfigMap) => {
    // Normalize config to include all current columns and drop stale ones
    const normalized: ColumnConfigMap = columns.reduce((acc, c, idx) => {
      const entry = cfg[c.key] ?? { isVisible: true, index: idx, align: c.align };
      // keep align from column if not explicitly set
      acc[c.key] = { ...entry, align: entry.align ?? c.align };
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
        const entry = loaded[c.key] ?? { isVisible: true, index: idx, align: c.align };
        acc[c.key] = { ...entry, align: entry.align ?? c.align };
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

      <div className="flex items-center gap-2">
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
                onChange={handleConfigChange}
                onReset={() =>
                  handleConfigChange(
                    columns.reduce((acc, c, idx) => {
                      acc[c.key] = { isVisible: true, index: idx, align: c.align };
                      return acc;
                    }, {} as ColumnConfigMap),
                  )
                }
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );

  const renderLoadingOrEmpty = () => (
    <CommonTableLoadingState
      loading={loading}
      isLoadingMore={isLoadingMore}
      dataLength={data?.length || 0}
      hasMore={hasMore}
      columns={shownColumns}
      skeletonRows={skeletonRows}
      loadingMoreRows={loadingMoreRows}
    />
  );

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {renderHeader()}

      <div ref={containerRef} className="rounded-md border max-h-[600px] overflow-auto relative">
        <Table className="min-w-full table-fixed w-full">
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              {shownColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`${getAlignClass(col.align)} truncate p-3 ${col.headClassName || ''}`}
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
                renderLoadingOrEmpty()
              )
            ) : data && data.length > 0 ? (
              <>
                {data.map((item, rowIdx) => (
                  <TableRow key={rowIdx}>
                    {shownColumns.map((col) => (
                      <td
                        key={`${col.key}-${rowIdx}`}
                        className={`${getAlignClass(col.align)} p-3  overflow-hidden`}
                        style={{ width: col.width }}
                      >
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </td>
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
                    <td colSpan={shownColumns.length}>
                      <div ref={sentinelRef} />
                    </td>
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
