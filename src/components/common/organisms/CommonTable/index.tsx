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
  onColumnConfigChange,
  storageKey,
  loading = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  className,
  rightHeaderNode,
  leftHeaderNode,
  emptyState,
  skeletonRows,
  loadingMoreRows = 3,
}: CommonTableProps<T>) {
  const { containerRef, sentinelRef } = useCommonInfiniteScroll({
    onLoadMore: onLoadMore || (() => {}),
    hasMore,
    isLoadingMore,
  });

  const shownColumns = useMemo(() => {
    return columns
      .filter((c) => columnConfig[c.key]?.isVisible !== false)
      .sort((a, b) => {
        const aIndex = columnConfig[a.key]?.index ?? 0;
        const bIndex = columnConfig[b.key]?.index ?? 0;
        return aIndex - bIndex;
      });
  }, [columns, columnConfig]);

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    if (align === 'left') return 'text-left';
    if (align === 'right') return 'text-right';
    return 'text-center';
  };

  const handleConfigChange = (cfg: ColumnConfigMap) => {
    onColumnConfigChange?.(cfg);
    saveColumnConfigToStorage(storageKey, cfg);
  };

  // initial load from storage
  useEffect(() => {
    const loaded = loadColumnConfigFromStorage(storageKey);
    if (loaded && onColumnConfigChange) {
      onColumnConfigChange(loaded);
    } else if (storageKey && onColumnConfigChange) {
      // persist current config as default
      saveColumnConfigToStorage(storageKey, columnConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <div ref={containerRef} className="rounded-md border max-h-[600px] overflow-y-auto relative">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              {shownColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className={`${getAlignClass(col.align)} truncate ${col.headClassName || ''}`}
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
                        className={`${getAlignClass(col.align)} p-3 ${col.className || ''}`}
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
