/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { FilterOperator } from '@/shared/types/filter.types';
import { FilterBuilder } from '@/shared/utils/filterBuilder';
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { walletSettingContainer } from '../../di/walletSettingDIContainer';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { IGetDepositRequestsPaginatedUseCase } from '../../domain';
import { clearError, setError, setLoading } from '../../slices';
import { initialState, tableReducer } from '../types/tableReducer.type';
import { convertToTableData } from '../utils';

export const useWalletSetting = () => {
  const dispatch = useAppDispatch();
  const { loading, filter, search, skipFilters } = useAppSelector((state) => state.walletSetting);

  const [state, dispatchTable] = useReducer(tableReducer, initialState);

  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  // Always merge search into filter before sending to API
  const buildMergedFilter = useCallback(() => {
    const rules = (filter.rules || []).filter((r) => {
      if ('field' in r) {
        return r.field !== 'search';
      }
      // Nếu là group, giữ lại (không phải rule search)
      return true;
    });
    if (search && search.trim() !== '') {
      rules.unshift({ field: 'search', operator: FilterOperator.CONTAINS, value: search });
    }
    return { ...filter, rules };
  }, [filter, search]);

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

        // Only apply filters if skipFilters is false
        const filterObject = skipFilters
          ? undefined
          : FilterBuilder.buildDynamicFilter(buildMergedFilter());

        const response = await useCase.execute(page, pageSize, filterObject);

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
    [dispatch, buildMergedFilter, skipFilters],
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
      // On initial load, use the skipFilters state from Redux
      fetchData(1, state.pagination.pageSize, false);
      isInitialLoad.current = false;
    }
  }, [fetchData]);

  // Refetch data when filterObject in redux changes
  useEffect(() => {
    if (!isInitialLoad.current) {
      dispatchTable({ type: 'SET_PAGE', payload: 1 });
      dispatchTable({ type: 'SET_DATA', payload: [] });
      dispatchTable({ type: 'SET_HAS_MORE', payload: true });
      fetchData(1, state.pagination.pageSize, false);
    }
  }, [filter, search, skipFilters, fetchData]);

  return {
    tableData: state,
    loading,
    loadMore,
    dispatchTable,
  };
};
