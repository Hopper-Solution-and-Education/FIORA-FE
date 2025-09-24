import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { setLoading } from '../../slices';
import { useLazyGetReferralTransactionsPaginatedQuery } from '../../slices/referralApi';
import {
  initialReferralTransactionTableState,
  referralTransactionTableReducer,
} from '../types/tableReducer.type';

export const useReferralTransactionDashboard = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((s) => s.referralTransaction);

  const [state, dispatchTable] = useReducer(
    referralTransactionTableReducer,
    initialReferralTransactionTableState,
  );

  const [fetchTransactions, { isLoading: isQueryLoading }] =
    useLazyGetReferralTransactionsPaginatedQuery();

  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  const fetchData = useCallback(
    async (page: number, pageSize: number, isLoadMore = false) => {
      if (isFetching.current) return;

      try {
        isFetching.current = true;

        if (!isLoadMore) {
          dispatch(setLoading(true));
        } else {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
        }

        // Use RTK Query to fetch data
        const result = await fetchTransactions({
          page,
          pageSize,
          filters: filter,
        }).unwrap();

        const { transactions, total, hasMore } = result;

        if (isLoadMore) {
          dispatchTable({ type: 'APPEND_DATA', payload: transactions });
        } else {
          dispatchTable({ type: 'SET_DATA', payload: transactions });
        }

        dispatchTable({
          type: 'SET_PAGINATION',
          payload: { current: page, pageSize, total },
        });
        dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });
      } catch (error) {
        console.error('Failed to fetch referral transactions:', error);
        dispatchTable({ type: 'SET_HAS_MORE', payload: false });
      } finally {
        dispatch(setLoading(false));
        dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        isFetching.current = false;
      }
    },
    [dispatch, filter, fetchTransactions],
  );

  useEffect(() => {
    if (isInitialLoad.current) {
      fetchData(1, state.pagination.pageSize, false);
      isInitialLoad.current = false;
    }
  }, [fetchData]);

  useEffect(() => {
    if (!isInitialLoad.current) {
      dispatchTable({ type: 'SET_PAGE', payload: 1 });
      dispatchTable({ type: 'SET_DATA', payload: [] });
      dispatchTable({ type: 'SET_HAS_MORE', payload: true });
      fetchData(1, state.pagination.pageSize, false);
    }
  }, [filter, fetchData]);

  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.isLoadingMore || isFetching.current) return;
    const next = state.pagination.current + 1;
    await fetchData(next, state.pagination.pageSize, true);
  }, [state.hasMore, state.isLoadingMore, state.pagination, fetchData]);

  return {
    tableData: state,
    loading: useAppSelector((s) => s.referralTransaction.loading) || isQueryLoading,
    loadMore,
    dispatchTable,
  };
};
