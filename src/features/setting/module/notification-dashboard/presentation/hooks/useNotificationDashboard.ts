/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { notificationDashboardContainer } from '../../di/notificationDashboardDIContainer';
import { NOTIFICATION_DASHBOARD_TYPES } from '../../di/notificationDashboardDIContainer.type';
import { IGetNotificationsPaginatedUseCase } from '../../domain/usecase/GetNotificationsPaginatedUseCase';
import { setLoading } from '../../slices';
import { initialState, tableReducer } from '../types/tableReducer.type';
import { cleanFilter, convertToTableData } from '../utils';

/**
 * Custom hook for managing notification dashboard data and state
 * Handles data fetching, pagination, filtering, and loading states
 */
export const useNotificationDashboard = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.notificationDashboard);

  // Local table state management using reducer
  const [state, dispatchTable] = useReducer(tableReducer, initialState);

  // Refs to prevent duplicate API calls and track initial load
  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  /**
   * Fetch data from API with pagination and filtering
   * @param page - Current page number
   * @param pageSize - Number of items per page
   * @param isLoadMore - Whether this is a load more operation (append vs replace)
   */
  const fetchData = useCallback(
    async (page: number, pageSize: number, isLoadMore = false) => {
      if (isFetching.current) return; // Prevent concurrent API calls
      isFetching.current = true;

      // Set appropriate loading state
      if (isLoadMore) {
        dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
      } else {
        dispatch(setLoading(true));
      }

      try {
        // Get use case from DI container
        const useCase = notificationDashboardContainer.get<IGetNotificationsPaginatedUseCase>(
          NOTIFICATION_DASHBOARD_TYPES.IGetNotificationsPaginatedUseCase,
        );

        // Clean filter and fetch data
        const clean = cleanFilter(filter);
        const response = await useCase.execute(page, pageSize, clean);

        // Convert response to table data format
        const tableData = response.items.map(convertToTableData);

        // Update table state based on operation type
        if (isLoadMore) {
          dispatchTable({ type: 'APPEND_DATA', payload: tableData });
        } else {
          dispatchTable({ type: 'SET_DATA', payload: tableData });
        }

        // Update pagination information
        dispatchTable({
          type: 'SET_PAGINATION',
          payload: {
            current: response.page,
            pageSize: response.pageSize,
            total: response.total ?? 0,
          },
        });

        // Determine if there are more pages to load
        const hasMore =
          response.page <
          (response.totalPage ?? Math.ceil((response.total ?? 0) / response.pageSize));
        dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });
      } finally {
        // Clear loading states
        if (isLoadMore) {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        } else {
          dispatch(setLoading(false));
        }
        isFetching.current = false;
      }
    },
    [dispatch, filter],
  );

  // Initial data load on component mount
  useEffect(() => {
    if (isInitialLoad.current) {
      fetchData(1, state.pagination.pageSize, false);
      isInitialLoad.current = false;
    }
  }, [fetchData]);

  // Refetch data when filter changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad.current) {
      dispatchTable({ type: 'SET_PAGE', payload: 1 });
      dispatchTable({ type: 'SET_DATA', payload: [] });
      dispatchTable({ type: 'SET_HAS_MORE', payload: true });
      fetchData(1, state.pagination.pageSize, false);
    }
  }, [filter, fetchData]);

  /**
   * Load more data for infinite scroll
   * Called when user scrolls near the bottom of the table
   */
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

  return {
    tableData: state,
    loading: useAppSelector((state) => state.notificationDashboard.loading),
    loadMore,
    dispatchTable,
  };
};
