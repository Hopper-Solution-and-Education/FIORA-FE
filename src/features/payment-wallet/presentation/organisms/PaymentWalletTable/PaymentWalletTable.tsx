'use client';

import { CommonTable } from '@/components/common/organisms';
import { ColumnConfigMap } from '@/components/common/organisms/CommonTable/types';
import { useRef, useState } from 'react';
import {
  EmptyState,
  ErrorDisplay,
  LoadingIndicator,
  SearchFilterHeader,
  usePaymentWalletTableColumns,
} from './components';
import { useLazyLoading, usePaymentWalletTableData } from './hooks';

const PaymentWalletTable = () => {
  const toggleRef = useRef<HTMLDivElement>(null);
  const columns = usePaymentWalletTableColumns();

  // Column configuration
  const [columnConfig, setColumnConfig] = useState<ColumnConfigMap>(() => ({
    no: { isVisible: true, index: 0, align: 'center' },
    date: { isVisible: true, index: 1, align: 'left' },
    type: { isVisible: true, index: 2, align: 'center' },
    amount: { isVisible: true, index: 3, align: 'right' },
    from: { isVisible: true, index: 4, align: 'left' },
    to: { isVisible: true, index: 5, align: 'left' },
    remark: { isVisible: true, index: 6, align: 'left' },
    actions: { isVisible: true, index: 7, align: 'center' },
  }));

  // Data management
  const {
    displayData,
    paginationParams,
    transactionsLoading,
    transactionsError,
    hasNextPage,
    loadMoreTransactions,
    handleSearch,
    handleFilterChange,
  } = usePaymentWalletTableData();

  // Lazy loading
  useLazyLoading({
    toggleRef,
    displayDataLength: displayData.length,
    transactionsLoading,
    paginationParams,
    loadMoreTransactions,
  });

  // Header components
  const { leftHeaderNode, rightHeaderNode } = SearchFilterHeader({
    displayDataLength: displayData.length,
    paginationParams,
    onSearch: handleSearch,
    onFilterChange: handleFilterChange,
  });

  // Loading state for initial load
  if (transactionsLoading && displayData.length === 0) {
    return <LoadingIndicator isLoading={true} hasData={false} />;
  }

  return (
    <div className="space-y-4">
      <CommonTable
        data={displayData}
        columns={columns}
        columnConfig={columnConfig}
        onColumnConfigChange={setColumnConfig}
        storageKey="payment-wallet-table"
        loading={transactionsLoading}
        hasMore={hasNextPage}
        isLoadingMore={transactionsLoading && displayData.length > 0}
        onLoadMore={loadMoreTransactions}
        className="min-h-[400px]"
        emptyState={<EmptyState />}
        leftHeaderNode={leftHeaderNode}
        rightHeaderNode={rightHeaderNode}
      />

      {/* Intersection Observer Target */}
      <div
        className="target-div w-full h-full min-h-5 flex justify-center items-center"
        ref={toggleRef}
      >
        <LoadingIndicator
          isLoading={transactionsLoading}
          hasData={displayData.length > 0}
          isLoadingMore={true}
        />
      </div>

      <ErrorDisplay error={transactionsError} />
    </div>
  );
};

export default PaymentWalletTable;
