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

/**
 * Custom hook for managing wallet setting table state and data fetching
 *
 * This hook handles:
 * - Table data state management using useReducer
 * - API data fetching with pagination and filtering
 * - Search functionality integration
 * - Load more functionality for infinite scroll
 * - Error handling and loading states
 */

/**
 * IMPORTANT: Test Coverage Required
 *
 * This hook has comprehensive test coverage that must be maintained.
 * After making any changes to this hook, run the test suite to ensure:
 * - All existing functionality continues to work
 * - New features are properly tested
 * - No regressions are introduced
 *
 * Test Command:
 * pnpm test src/features/setting/module/wallet/presentation/hooks/__tests__/useWalletSetting.test.ts --coverage=false

 */
export const useWalletSetting = () => {
  const dispatch = useAppDispatch();
  const { loading, filter, search, skipFilters } = useAppSelector((state) => state.walletSetting);

  // Local table state management using reducer
  const [state, dispatchTable] = useReducer(tableReducer, initialState);

  // Refs to prevent duplicate API calls and track initial load
  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  /**
   * Merges search term into filter rules for API requests
   * Always prioritizes search over existing search filters
   */
  const buildMergedFilter = useCallback(() => {
    // Remove existing search rules from filter
    const rules = (filter.rules || []).filter((r) => {
      if ('field' in r) {
        return r.field !== 'search';
      }

      // Keep group filters (not search rules)
      return true;
    });

    // Add current search term as the first rule if it exists
    if (search && search.trim() !== '') {
      rules.unshift({ field: 'search', operator: FilterOperator.CONTAINS, value: search });
    }
    return { ...filter, rules };
  }, [filter, search]);

  /**
   * Fetches deposit request data from API with pagination and filtering
   *
   * @param page - Current page number
   * @param pageSize - Number of items per page
   * @param isLoadMore - Whether this is a load more operation
   */
  const fetchData = useCallback(
    async (page: number, pageSize: number, isLoadMore = false) => {
      // Prevent concurrent API calls
      if (isFetching.current) {
        return;
      }
      isFetching.current = true;

      // Set appropriate loading state
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

        // Build filter object only if skipFilters is false
        const filterObject = skipFilters
          ? undefined
          : FilterBuilder.buildDynamicFilter(buildMergedFilter());

        const response = await useCase.execute(page, pageSize, filterObject);

        // Convert API response to table data format
        const tableData = response.items.map(convertToTableData);

        // Update table state based on operation type
        if (isLoadMore) {
          dispatchTable({ type: 'APPEND_DATA', payload: tableData });
        } else {
          dispatchTable({ type: 'SET_DATA', payload: tableData });
        }

        // Calculate if there are more pages available
        const hasMore = response.page * response.pageSize < response.total;
        dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });

        // Update pagination information
        dispatchTable({
          type: 'SET_PAGINATION',
          payload: {
            current: response.page,
            pageSize: response.pageSize,
            total: response.total,
          },
        });

        // Clear loading state
        if (isLoadMore) {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        } else {
          dispatch(setLoading(false));
        }
      } catch (error: any) {
        console.error('Error fetching data:', error);
        dispatch(setError(error.message || 'Failed to fetch deposit requests'));

        // Handle error state for load more vs initial load
        if (isLoadMore) {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        } else {
          // Clear data and reset pagination on error
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

  // Initial data load on component mount
  useEffect(() => {
    if (isInitialLoad.current) {
      fetchData(1, state.pagination.pageSize, false);
      isInitialLoad.current = false;
    }
  }, [fetchData]);

  // Refetch data when filters, search, or skipFilters change
  useEffect(() => {
    if (!isInitialLoad.current) {
      // Reset table state and fetch first page
      dispatchTable({ type: 'SET_PAGE', payload: 1 });
      dispatchTable({ type: 'SET_DATA', payload: [] });
      dispatchTable({ type: 'SET_HAS_MORE', payload: true });
      fetchData(1, state.pagination.pageSize, false);
    }
  }, [filter, search, skipFilters, fetchData]);

  /**
   * Load more function for infinite scroll functionality
   * Fetches the next page of data and appends to existing data
   */
  const loadMore = useCallback(async () => {
    // Prevent loading if no more data, already loading, or currently fetching
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

  return {
    tableData: state,
    loading,
    loadMore,
    dispatchTable,
  };
};
