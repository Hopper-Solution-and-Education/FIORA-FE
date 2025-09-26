'use client';

import { ColumnConfigMap } from '@/components/common/organisms/CommonTable/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/shared/utils';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { EmptyState, SearchFilterHeader, usePaymentWalletTableColumns } from './components';
import LoadingIndicator from './components/LoadingIndicator';
import { usePaymentWalletTableData } from './hooks';

const PaymentWalletTable = () => {
  const columns = usePaymentWalletTableColumns();

  // Column configuration
  const [columnConfig] = useState<ColumnConfigMap>(() => ({
    no: { isVisible: true, index: 0, align: 'center' },
    date: { isVisible: true, index: 1, align: 'center' },
    type: { isVisible: true, index: 2, align: 'center' },
    amount: { isVisible: true, index: 3, align: 'center' },
    from: { isVisible: true, index: 4, align: 'center' },
    to: { isVisible: true, index: 5, align: 'center' },
    remark: { isVisible: true, index: 6, align: 'center' },
    actions: { isVisible: true, index: 7, align: 'center' },
  }));

  // Data management
  const {
    displayData,
    paginationParams,
    setPaginationParams,
    transactionsLoading,
    transactionsError,
    hasNextPage,
    loadMoreTransactions,
    handleSearch,
    handleFilterChange,
  } = usePaymentWalletTableData();

  // Sentinel ref for infinite scrolling
  const toggleRef = useRef<HTMLDivElement | null>(null);

  if (transactionsError) {
    toast.error(transactionsError);
  }

  // Header components
  const { leftHeaderNode, rightHeaderNode } = SearchFilterHeader({
    displayDataLength: displayData.length,
    paginationParams,
    onSearch: handleSearch,
    onFilterChange: handleFilterChange,
  });

  // Build visible columns based on columnConfig (order + visibility)
  const visibleColumns = useMemo(() => {
    const byKey: Record<string, number> = Object.fromEntries(
      Object.entries(columnConfig).map(([k, v]) => [k, v.index]),
    );

    return (
      columns
        // keep only columns that are configured as visible (default true if missing)
        .filter((col) => columnConfig[col.key]?.isVisible !== false)
        // sort by configured index with fallback to their current order
        .sort((a, b) => (byKey[a.key] ?? 0) - (byKey[b.key] ?? 0))
    );
  }, [columns, columnConfig]);

  const getAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      default:
        return 'text-center';
    }
  };

  // Infinite scroll: observe sentinel and load more when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Only load more if not currently loading and there's more data
          if (!transactionsLoading && hasNextPage) {
            // Bump UI page for numbering/display purposes only
            setPaginationParams((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
            loadMoreTransactions();
          }
        }
      },
      { threshold: 0.2 },
    );

    const current = toggleRef.current;
    if (current && displayData.length >= 1) {
      observer.observe(current);
    }

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [
    displayData.length,
    hasNextPage,
    loadMoreTransactions,
    setPaginationParams,
    transactionsLoading,
  ]);

  return (
    <div className="space-y-4 h-fit">
      <Table className="border-[1px] border-gray-300">
        <TableHeader>
          <TableRow className="hover:bg-none">
            <TableCell colSpan={visibleColumns.length}>
              <div className="w-full flex justify-between py-2 px-5">
                <div className="flex flex-col justify-start items-start gap-4">
                  {leftHeaderNode}
                </div>
                <div className="flex items-center gap-2">{rightHeaderNode}</div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow className="font-bold text-center">
            {visibleColumns.map((col) => (
              <TableCell
                key={col.key}
                className={cn(getAlignClass(col.align), col.headClassName)}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.title}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionsLoading && displayData.length === 0 ? (
            // Skeleton rows on initial load
            Array.from({ length: 12 }).map((_, rIdx) => (
              <TableRow key={`skeleton-row-${rIdx}`}>
                {visibleColumns.map((col) => (
                  <TableCell
                    key={`skeleton-cell-${col.key}-${rIdx}`}
                    className={getAlignClass(col.align)}
                  >
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <>
              {displayData.map((row, idx) => (
                <TableRow key={(row as any).id ?? idx} className="text-center">
                  {visibleColumns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={getAlignClass(col.align)}
                      style={col.width ? { width: col.width } : undefined}
                    >
                      {col.render ? col.render(row as any) : ((row as any)[col.key] ?? '-')}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {displayData.length === 0 && !transactionsLoading && (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length}>
                    <EmptyState />
                  </TableCell>
                </TableRow>
              )}
              {/* Sentinel row for infinite scrolling and loading-more indicator */}
              {displayData.length > 0 && (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length}>
                    <div
                      className="target-div w-full h-full min-h-5 flex justify-center items-center"
                      ref={toggleRef}
                    >
                      <LoadingIndicator
                        isLoading={transactionsLoading}
                        hasData={displayData.length > 0}
                        isLoadingMore={transactionsLoading && displayData.length > 0}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentWalletTable;
