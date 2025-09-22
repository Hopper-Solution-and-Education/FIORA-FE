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

  const isFetching = useRef(false);
  const isChartDataFetched = useRef(false);

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

      setChartData(res.summary || []);
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

  const fetchData = useCallback(async () => {
    if (isFetching.current) return;

    isFetching.current = true;
    dispatchTable({ type: 'SET_LOADING', payload: true });

    try {
      const useCase = savingInterestContainer.get<IGetSavingInterestPaginatedUseCase>(
        SAVING_INTEREST_TYPES.IGetSavingInterestPaginatedUseCase,
      );

      // Load all data without pagination - don't pass page/pageSize
      const res = await useCase.execute(0, 0, {
        status: filterState.status,
        membershipTier: filterState.membershipTier,
        email: filterState.email,
        updatedBy: filterState.updatedBy,
        search: filterState.search,
        fromDate: filterState.fromDate ? filterState.fromDate.toISOString() : '',
        toDate: filterState.toDate ? filterState.toDate.toISOString() : '',
      });

      dispatchTable({
        type: 'SET_DATA',
        payload: {
          items: res.items || [],
          total: res.total || 0,
          page: 1,
          pageSize: res.total || 0,
          totalPages: 1,
        },
      });
    } catch (error) {
      console.error('Error fetching saving interest data:', error);
      dispatchTable({ type: 'SET_ERROR', payload: 'Failed to fetch data' });
    } finally {
      dispatchTable({ type: 'SET_LOADING', payload: false });
      isFetching.current = false;
    }
  }, [filterState]);

  // Fetch data when filter changes
  useEffect(() => {
    // Reset data when filter changes and fetch fresh data
    dispatchTable({ type: 'SET_PAGE', payload: 1 });
    fetchData();
  }, [filterState, fetchData]);

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
