import { CURRENCY } from '@/shared/constants';
import { FilterCriteria } from '@/shared/types/filter.types';
import { useCallback, useEffect, useState } from 'react';
import { usePaymentWalletTransactions } from '../../../hooks';
import { PaginationParams, PaymentWalletTransaction, initPaginationParams } from '../types';

export const usePaymentWalletTableData = () => {
  const {
    transactions: transactionsResponse,
    transactionsLoading,
    transactionsError,
    hasNextPage,
    totalCount,
    pagination,
    loadMoreTransactions,
    searchTransactions,
    filterTransactions,
    filterCriteria,
  } = usePaymentWalletTransactions();

  const [displayData, setDisplayData] = useState<PaymentWalletTransaction[]>([]);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>(initPaginationParams);

  // Handle data updates
  useEffect(() => {
    if (transactionsResponse && Array.isArray(transactionsResponse)) {
      setDisplayData((prevDisplayData) => {
        // Continuous row numbering regardless of cursor-based pagination
        const startingRowNumber = prevDisplayData.length + 1;

        const mappedData = transactionsResponse.map((item: any, index: number) => ({
          id: item.id,
          createdAt: item.createdAt,
          type: item.type,
          amount: item.amount,
          // Prefer wallet names from nested objects; fall back to flat fields or 'Unknown'
          from: item?.fromWallet?.name ?? item?.fromWallet?.type,
          fromId: item?.fromWallet?.id ?? item?.fromId,
          toId: item?.toWallet?.id ?? item?.toId,
          to: item?.toWallet?.name ?? item?.toWallet?.type,
          remark: item.description || item.remark || 'No remark',
          currency: item.currency || CURRENCY.FX,
          rowNumber: startingRowNumber + index,
        }));

        // If this is a fresh load (we cleared transactions before fetching), replace data
        if (!prevDisplayData.length || paginationParams.currentPage === 1) {
          return mappedData;
        }
        return [...prevDisplayData, ...mappedData];
      });

      // Prefer pagination values from API; fallback to computed totalCount or current display length
      setPaginationParams((prev) => ({
        ...prev,
        totalPage:
          pagination?.totalPage !== undefined
            ? pagination.totalPage
            : Math.max(
                1,
                Math.ceil(
                  (pagination?.total || totalCount || transactionsResponse.length) / prev.pageSize,
                ),
              ),
        totalItems:
          pagination?.total !== undefined && pagination.total > 0
            ? pagination.total
            : totalCount > 0
              ? totalCount
              : transactionsResponse.length,
      }));
    }
  }, [transactionsResponse, totalCount, pagination, paginationParams.currentPage]);

  // Handle search functionality
  const handleSearch = useCallback(
    (searchTerm: string) => {
      searchTransactions(searchTerm);
      setPaginationParams((prev) => ({ ...prev, currentPage: 1 }));
    },
    [searchTransactions],
  );

  // Handle filter functionality
  const handleFilterChange = useCallback(
    (newFilter: FilterCriteria) => {
      filterTransactions(newFilter);
      setPaginationParams((prev) => ({ ...prev, currentPage: 1 }));
    },
    [filterTransactions],
  );

  return {
    displayData,
    paginationParams,
    setPaginationParams,
    transactionsLoading,
    transactionsError,
    hasNextPage,
    loadMoreTransactions,
    handleSearch,
    handleFilterChange,
    filterCriteria,
  };
};
