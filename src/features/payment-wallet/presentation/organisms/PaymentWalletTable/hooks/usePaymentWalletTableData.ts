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
    loadMoreTransactions,
    refreshTransactions,
    searchTransactions,
    filterTransactions,
    filterCriteria,
  } = usePaymentWalletTransactions();

  const [displayData, setDisplayData] = useState<PaymentWalletTransaction[]>([]);
  const [paginationParams, setPaginationParams] = useState<PaginationParams>(initPaginationParams);

  // Handle data updates
  useEffect(() => {
    if (transactionsResponse && Array.isArray(transactionsResponse)) {
      const mappedData = transactionsResponse.map((item: any) => ({
        id: item.id,
        createdAt: item.createdAt,
        type: item.type,
        amount: item.amount,
        from: item.from || 'Unknown',
        to: item.to || 'Unknown',
        remark: item.description || item.remark || 'No remark',
        currency: item.currency || CURRENCY.FX,
      }));

      if (paginationParams.currentPage === 1) {
        setDisplayData(mappedData);
      } else {
        setDisplayData((prev) => [...prev, ...mappedData]);
      }

      setPaginationParams((prev) => ({
        ...prev,
        totalPage: Math.ceil(totalCount / prev.pageSize),
        totalItems: totalCount,
      }));
    }
  }, [transactionsResponse, totalCount, paginationParams.currentPage]);

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
    refreshTransactions,
    handleSearch,
    handleFilterChange,
    filterCriteria,
  };
};
