import { useAppSelector } from '@/store';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { ReferralChartItem } from '../../data/dto/response/ReferralChartResponse';
import { referralCronjobContainer } from '../../di/referralCronjobDashboardDI';
import { REFERRAL_CRONJOB_TYPES } from '../../di/referralCronjobDashboardDI.type';
import { IGetReferralChartDataUseCase } from '../../domain/usecase/GetReferralChartDataUseCase';
import { IGetReferralCronjobsPaginatedUseCase } from '../../domain/usecase/GetReferralCronjobsPaginatedUseCase';
import { initialState, tableReducer } from '../types/tableReducer.type';

export const useReferralCronjobDashboard = () => {
  const { filter } = useAppSelector((s) => s.referralCronjob);

  const [state, dispatchTable] = useReducer(tableReducer, initialState);
  const [chartData, setChartData] = useState<ReferralChartItem[]>([]);
  const [chartLoading, setChartLoading] = useState(false);

  const isFetching = useRef(false);
  const isChartDataFetched = useRef(false);

  const fetchChartData = useCallback(async () => {
    if (isChartDataFetched.current) return;

    isChartDataFetched.current = true;
    setChartLoading(true);

    try {
      const useCase = referralCronjobContainer.get<IGetReferralChartDataUseCase>(
        REFERRAL_CRONJOB_TYPES.IGetReferralChartDataUseCase,
      );

      // Fetch chart data without any filters (get all data)
      const res = await useCase.execute({
        status: [],
        typeOfBenefit: [],
        emailReferrer: [],
        emailReferee: [],
        updatedBy: [],
        search: '',
        fromDate: '',
        toDate: '',
      });

      setChartData(res.data?.summary || []);
    } catch (error) {
      console.error('Error fetching referral chart:', error);
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
      if (isLoadMore) {
        dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
      } else {
        dispatchTable({ type: 'SET_LOADING', payload: true });
      }

      try {
        const useCase = referralCronjobContainer.get<IGetReferralCronjobsPaginatedUseCase>(
          REFERRAL_CRONJOB_TYPES.IGetReferralCronjobsPaginatedUseCase,
        );

        const res = await useCase.execute(page, pageSize, {
          status: filter.status,
          typeOfBenefit: filter.typeOfBenefit,
          emailReferrer: filter.emailReferrer,
          emailReferee: filter.emailReferee,
          updatedBy: filter.updatedBy,
          search: filter.search,
          fromDate: filter.fromDate ? filter.fromDate.toISOString() : '',
          toDate: filter.toDate ? filter.toDate.toISOString() : '',
        });

        const items = res.data?.items || [];

        // Calculate pagination info
        const currentPage = res.data?.page || page;
        const totalPages = res.data?.totalPages || Math.ceil((res.data?.total || 0) / pageSize);
        const hasMore = currentPage < totalPages;

        if (isLoadMore) {
          dispatchTable({ type: 'APPEND_DATA', payload: items });
          // Update current page after successful load more
          dispatchTable({ type: 'SET_PAGE', payload: currentPage });
        } else {
          dispatchTable({
            type: 'SET_DATA',
            payload: {
              items,
              total: res.data?.total || 0,
              page: currentPage,
              pageSize: res.data?.pageSize || pageSize,
              totalPages: totalPages,
            },
          });
        }

        dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });

        // Debug logging
        console.log('Referral Load More Debug:', {
          currentPage,
          totalPages,
          hasMore,
          total: res.data?.total,
          pageSize,
          itemsLength: items.length,
          isLoadMore,
        });
      } catch (error) {
        console.error('Error fetching referral data:', error);
        dispatchTable({ type: 'SET_ERROR', payload: 'Failed to fetch data' });
      } finally {
        if (isLoadMore) {
          dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: false });
        } else {
          dispatchTable({ type: 'SET_LOADING', payload: false });
        }
        isFetching.current = false;
      }
    },
    [filter],
  );

  // Initial data load and filter changes
  useEffect(() => {
    // Reset data and fetch fresh data
    dispatchTable({ type: 'SET_PAGE', payload: 1 });
    dispatchTable({
      type: 'SET_DATA',
      payload: { items: [], total: 0, page: 1, pageSize: state.pageSize, totalPages: 1 },
    });
    dispatchTable({ type: 'SET_HAS_MORE', payload: true });
    fetchData(1, state.pageSize, false);
  }, [filter, fetchData, state.pageSize]);

  // Load more function for infinite scroll
  const loadMore = useCallback(async () => {
    console.log('Load More Trigger:', {
      hasMore: state.hasMore,
      isLoadingMore: state.isLoadingMore,
      isFetching: isFetching.current,
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      totalItems: state.total,
    });

    if (!state.hasMore || state.isLoadingMore || isFetching.current) return;
    const nextPage = state.currentPage + 1;
    await fetchData(nextPage, state.pageSize, true);
  }, [
    state.hasMore,
    state.isLoadingMore,
    state.currentPage,
    state.pageSize,
    state.total,
    fetchData,
  ]);

  return {
    // Table data
    data: state.items,
    loading: state.loading,
    totalItems: state.total,
    hasMore: state.hasMore,
    isLoadingMore: state.isLoadingMore,

    // Chart data
    chartData,
    chartLoading,

    // Actions
    fetchData,
    loadMore,
  };
};
