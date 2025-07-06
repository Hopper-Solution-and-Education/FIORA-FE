/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { walletSettingContainer } from '../../di/walletSettingDIContainer';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { IGetDepositRequestsPaginatedUseCase } from '../../domain';
import { clearError, setError, setLoading } from '../../slices';
import { initialState, tableReducer } from '../types';
import { convertToTableData } from '../utils/convertTableData';

export const useWalletSetting = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.walletSetting);
  const [state, dispatchTable] = useReducer(tableReducer, initialState);
  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  const fetchData = useCallback(
    async (page: number, pageSize: number, isLoadMore = false) => {
      if (isFetching.current) {
        return;
      }
      isFetching.current = true;

      if (isLoadMore) {
        dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
      } else {
        dispatch(setLoading(true));
      }
      dispatch(clearError());

      try {
        const useCase = walletSettingContainer.get<IGetDepositRequestsPaginatedUseCase>(
          WALLET_SETTING_TYPES.IGetDepositRequestsPaginatedUseCase,
        );

        const response = await useCase.execute(page, pageSize);

        const tableData = response.items.map(convertToTableData);

        if (isLoadMore) {
          dispatchTable({ type: 'APPEND_DATA', payload: tableData });
        } else {
          dispatchTable({ type: 'SET_DATA', payload: tableData });
        }

        const hasMore = response.page * response.pageSize < response.total;

        dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });

        dispatchTable({
          type: 'SET_PAGINATION',
          payload: {
            current: response.page,
            pageSize: response.pageSize,
            total: response.total,
          },
        });

        if (isLoadMore) {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        } else {
          dispatch(setLoading(false));
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        dispatch(setError(error.message || 'Failed to fetch deposit requests'));

        if (isLoadMore) {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        } else {
          dispatchTable({ type: 'SET_DATA', payload: [] });
          dispatchTable({
            type: 'SET_PAGINATION',
            payload: { ...state.pagination, total: 0 },
          });
          dispatch(setLoading(false));
        }
      } finally {
        isFetching.current = false;
      }
    },
    [dispatch],
  );

  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.isLoadingMore || isFetching.current) return;

    const nextPage = state.pagination.current + 1;

    await fetchData(nextPage, state.pagination.pageSize, true);
  }, [
    state.hasMore,
    state.isLoadingMore,
    state.pagination.current,
    state.pagination.pageSize,
    fetchData,
  ]);

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
  }, [state.filters.status, fetchData]);

  return {
    tableData: state,
    loading,
    loadMore,
  };
};
