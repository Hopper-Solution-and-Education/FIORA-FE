'use client';

import { FilterCriteria } from '@/shared/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo } from 'react';
import {
  clearTransactions,
  clearTransactionsError,
  setFilterCriteria,
  setPageSize,
  setSearchTerm,
} from '../../slices';
import { fetchPaymentWalletTransactionsAsyncThunk } from '../../slices/actions';
import type { FetchPaymentWalletTransactionsRequest } from '../../slices/types';

export const usePaymentWalletTransactions = () => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  // Selectors
  const transactions = useAppSelector((state) => state.paymentWallet.transactions);
  const transactionsLoading = useAppSelector((state) => state.paymentWallet.transactionsLoading);
  const transactionsError = useAppSelector((state) => state.paymentWallet.transactionsError);
  const pagination = useAppSelector((state) => state.paymentWallet.pagination);
  const searchTerm = useAppSelector((state) => state.paymentWallet.searchTerm);
  const filterCriteria = useAppSelector((state) => state.paymentWallet.filterCriteria);
  const pageSize = useAppSelector((state) => state.paymentWallet.pageSize);

  // Fetch transactions
  const fetchTransactions = useCallback(
    (params?: Partial<FetchPaymentWalletTransactionsRequest>) => {
      if (session?.user?.id) {
        const requestParams: FetchPaymentWalletTransactionsRequest = {
          pageSize: pageSize,
          searchParams: searchTerm || '',
          filters: filterCriteria.filters || {},
          ...params,
        };

        dispatch(fetchPaymentWalletTransactionsAsyncThunk(requestParams));
      }
    },
    [dispatch, session?.user?.id, pageSize, searchTerm, filterCriteria],
  );

  // Load more transactions (for pagination)
  const loadMoreTransactions = useCallback(() => {
    if (pagination?.hasNextPage && pagination?.lastCursor) {
      fetchTransactions({
        lastCursor: pagination.lastCursor,
      });
    }
  }, [fetchTransactions, pagination]);

  // Refresh transactions
  const refreshTransactions = useCallback(() => {
    dispatch(clearTransactions());
    fetchTransactions();
  }, [dispatch, fetchTransactions]);

  // Search transactions
  const searchTransactions = useCallback(
    (search: string) => {
      dispatch(setSearchTerm(search));
      dispatch(clearTransactions());
      fetchTransactions({ searchParams: search });
    },
    [dispatch, fetchTransactions],
  );

  // Filter transactions
  const filterTransactions = useCallback(
    (criteria: FilterCriteria) => {
      dispatch(setFilterCriteria(criteria));
      dispatch(clearTransactions());
      fetchTransactions({
        filters: criteria.filters,
        searchParams: criteria.search,
      });
    },
    [dispatch, fetchTransactions],
  );

  // Change page size
  const changePageSize = useCallback(
    (newPageSize: number) => {
      dispatch(setPageSize(newPageSize));
      dispatch(clearTransactions());
      fetchTransactions({ pageSize: newPageSize });
    },
    [dispatch, fetchTransactions],
  );

  // Clear transactions error
  const clearError = useCallback(() => {
    dispatch(clearTransactionsError());
  }, [dispatch]);

  // Auto-fetch transactions on session change
  useEffect(() => {
    if (!transactions.length && session?.user?.id) {
      fetchTransactions();
    }
  }, [session?.user?.id, transactions.length, fetchTransactions]);

  // Computed values
  const hasTransactions = useMemo(() => transactions.length > 0, [transactions]);
  const hasNextPage = useMemo(() => {
    if (!pagination) return false;
    return pagination.hasNextPage ?? pagination.page < pagination.totalPage;
  }, [pagination]);
  const hasPreviousPage = useMemo(() => {
    if (!pagination) return false;
    return pagination.hasPreviousPage ?? pagination.page > 1;
  }, [pagination]);
  const totalCount = useMemo(() => pagination?.total || 0, [pagination]);

  return {
    // Data
    transactions,
    pagination,
    searchTerm,
    filterCriteria,
    pageSize,

    // Loading states
    transactionsLoading,

    // Error states
    transactionsError,

    // Computed values
    hasTransactions,
    hasNextPage,
    hasPreviousPage,
    totalCount,

    // Actions
    fetchTransactions,
    loadMoreTransactions,
    refreshTransactions,
    searchTransactions,
    filterTransactions,
    changePageSize,
    clearError,
  };
};
