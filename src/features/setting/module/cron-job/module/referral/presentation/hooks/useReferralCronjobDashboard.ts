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

  const fetchData = useCallback(async () => {
    if (isFetching.current) return;

    isFetching.current = true;
    dispatchTable({ type: 'SET_LOADING', payload: true });

    try {
      const useCase = referralCronjobContainer.get<IGetReferralCronjobsPaginatedUseCase>(
        REFERRAL_CRONJOB_TYPES.IGetReferralCronjobsPaginatedUseCase,
      );

      // Load all data without pagination - don't pass page/pageSize
      const res = await useCase.execute(0, 0, {
        status: filter.status,
        typeOfBenefit: filter.typeOfBenefit,
        emailReferrer: filter.emailReferrer,
        emailReferee: filter.emailReferee,
        updatedBy: filter.updatedBy,
        search: filter.search,
        fromDate: filter.fromDate ? filter.fromDate.toISOString() : '',
        toDate: filter.toDate ? filter.toDate.toISOString() : '',
      });

      dispatchTable({
        type: 'SET_DATA',
        payload: {
          items: res.data?.items || [],
          total: res.data?.total || 0,
          page: 1,
          pageSize: res.data?.total || 0,
          totalPages: 1,
        },
      });
    } catch (error) {
      console.error('Error fetching referral data:', error);
      dispatchTable({ type: 'SET_ERROR', payload: 'Failed to fetch data' });
    } finally {
      dispatchTable({ type: 'SET_LOADING', payload: false });
      isFetching.current = false;
    }
  }, [filter]);

  // Fetch data when filter changes
  useEffect(() => {
    // Reset data when filter changes and fetch fresh data
    dispatchTable({ type: 'SET_PAGE', payload: 1 });
    fetchData();
  }, [filter, fetchData]);

  return {
    // Table data
    data: state.items,
    loading: state.loading,
    totalItems: state.total,

    // Chart data
    chartData,
    chartLoading,

    // Actions
    fetchData,
  };
};
