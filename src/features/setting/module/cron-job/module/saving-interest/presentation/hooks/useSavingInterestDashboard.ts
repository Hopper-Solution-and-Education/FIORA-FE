import { useAppSelector } from '@/store';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { SavingInterestChartItem } from '../../data/dto/response/SavingInterestResponse';
import { savingInterestContainer } from '../../di/savingInterestDashboardDI';
import { SAVING_INTEREST_TYPES } from '../../di/savingInterestDashboardDI.type';
import { IGetSavingInterestChartDataUseCase } from '../../domain/usecase/GetSavingInterestChartDataUseCase';
import { IGetSavingInterestPaginatedUseCase } from '../../domain/usecase/GetSavingInterestPaginatedUseCase';
import { initialState, tableReducer } from '../types/tableReducer.type';

export const useSavingInterestDashboard = () => {
  const filterState = useAppSelector((s) => s.savingInterest);

  const [state, dispatchTable] = useReducer(tableReducer, initialState);
  const [chartData, setChartData] = useState<SavingInterestChartItem[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFetching = useRef(false);
  const isChartDataFetched = useRef(false);
  const isInitialLoad = useRef(true);

  const fetchChartData = useCallback(async () => {
    if (isChartDataFetched.current) return;

    isChartDataFetched.current = true;
    setChartLoading(true);

    try {
      const useCase = savingInterestContainer.get<IGetSavingInterestChartDataUseCase>(
        SAVING_INTEREST_TYPES.IGetSavingInterestChartDataUseCase,
      );

      // Fetch chart data without any filters (get all data)
      const res = await useCase.execute({
        status: [],
        membershipTier: [],
        email: [],
        updatedBy: [],
        search: '',
        fromDate: '',
        toDate: '',
      });

      setChartData(res.tierInterestAmount || []);
    } catch (error) {
      console.error('Error fetching saving interest chart:', error);
      setChartData([]);
      // Reset the flag on error to allow retry
      isChartDataFetched.current = false;
    } finally {
      setChartLoading(false);
    }
  }, []);

  // Load chart data once on mount
  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchData = useCallback(
    async (page: number, pageSize: number, isLoadMore = false) => {
      if (isFetching.current) return;

      isFetching.current = true;

      // Set loading state
      if (isLoadMore) {
        dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
      } else {
        setLoading(true);
      }

      try {
        const useCase = savingInterestContainer.get<IGetSavingInterestPaginatedUseCase>(
          SAVING_INTEREST_TYPES.IGetSavingInterestPaginatedUseCase,
        );

        const res = await useCase.execute(page, pageSize, {
          status: filterState.status,
          membershipTier: filterState.membershipTier,
          email: filterState.email,
          updatedBy: filterState.updatedBy,
          search: filterState.search,
          fromDate: filterState.fromDate ? filterState.fromDate.toISOString().split('T')[0] : '',
          toDate: filterState.toDate ? filterState.toDate.toISOString().split('T')[0] : '',
        });

        const hasMore = page < (res.totalPages || 1);

        if (isLoadMore) {
          // Append data for load more
          dispatchTable({
            type: 'APPEND_DATA',
            payload: res.items || [],
          });
          dispatchTable({ type: 'SET_PAGE', payload: page });
          dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });
        } else {
          // Set initial data
          dispatchTable({
            type: 'SET_DATA',
            payload: res.items || [],
          });
          dispatchTable({
            type: 'SET_PAGINATION',
            payload: {
              current: page,
              pageSize,
              total: res.total || 0,
            },
          });
          dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });
          // Set statistics from API response
          dispatchTable({
            type: 'SET_STATISTICS',
            payload: {
              totalSuccess: res.totalSuccess || 0,
              totalFailed: res.totalFailed || 0,
            },
          });
        }
      } catch (error) {
        console.error('Error fetching saving interest data:', error);
      } finally {
        if (isLoadMore) {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        } else {
          setLoading(false);
        }
        isFetching.current = false;
      }
    },
    [filterState],
  );

  // Initial data fetch
  useEffect(() => {
    if (isInitialLoad.current) {
      fetchData(1, state.pagination.pageSize, false);
      isInitialLoad.current = false;
    }
  }, [fetchData]);

  // Fetch data when filter changes
  useEffect(() => {
    if (!isInitialLoad.current) {
      dispatchTable({ type: 'SET_PAGE', payload: 1 });
      dispatchTable({ type: 'SET_DATA', payload: [] });
      dispatchTable({ type: 'SET_HAS_MORE', payload: true });
      fetchData(1, state.pagination.pageSize, false);
    }
  }, [filterState, fetchData]);

  // Load more function
  const loadMore = useCallback(async () => {
    if (!state.hasMore || state.isLoadingMore || isFetching.current) return;
    const nextPage = state.pagination.current + 1;
    await fetchData(nextPage, state.pagination.pageSize, true);
  }, [state.hasMore, state.isLoadingMore, state.pagination, fetchData]);

  return {
    // Table data (match Membership structure)
    tableData: state,
    loading,
    loadMore,

    // Legacy support
    data: state.data,
    totalItems: state.pagination.total,
    hasMore: state.hasMore,
    isLoadingMore: state.isLoadingMore,

    // Chart data
    chartData,
    chartLoading,

    // Actions
    fetchData,
  };
};
