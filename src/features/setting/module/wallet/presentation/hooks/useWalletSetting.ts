'use client';

import { WALLET_SETTING_CONSTANTS } from '@/features/setting/constants';
import { useCallback, useEffect, useReducer } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { walletSettingContainer } from '../../di/walletSettingDIContainer';
import { WALLET_SETTING_TYPES } from '../../di/walletSettingDIContainer.type';
import { DepositRequestStatus } from '../../domain/enum';
import { IGetDepositRequestsPaginatedUseCase } from '../../domain/usecase/GetDepositRequestsPaginatedUsecase';
import { clearError, setError, setLoading } from '../../slices/walletSettingSlice';
import { WalletSettingTableData } from '../types';

interface TableState {
  data: WalletSettingTableData[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  filters: {
    status: DepositRequestStatus | 'all';
    search: string;
  };
  selectedItem: WalletSettingTableData | null;
  showForm: boolean;
}

type TableAction =
  | { type: 'SET_DATA'; payload: WalletSettingTableData[] }
  | { type: 'SET_PAGINATION'; payload: { current: number; pageSize: number; total: number } }
  | { type: 'SET_STATUS'; payload: DepositRequestStatus | 'all' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_SELECTED_ITEM'; payload: WalletSettingTableData | null }
  | { type: 'SET_SHOW_FORM'; payload: boolean }
  | {
      type: 'UPDATE_ITEM_STATUS';
      payload: { id: string; status: DepositRequestStatus; remark?: string };
    };

// Reducer function
const tableReducer = (state: TableState, action: TableAction): TableState => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };

    case 'SET_PAGINATION':
      return { ...state, pagination: action.payload };

    case 'SET_STATUS':
      return { ...state, filters: { ...state.filters, status: action.payload } };

    case 'SET_SEARCH':
      return { ...state, filters: { ...state.filters, search: action.payload } };

    case 'SET_PAGE':
      return { ...state, pagination: { ...state.pagination, current: action.payload } };

    case 'SET_SELECTED_ITEM':
      return { ...state, selectedItem: action.payload };

    case 'SET_SHOW_FORM':
      return { ...state, showForm: action.payload };

    case 'UPDATE_ITEM_STATUS':
      return {
        ...state,
        data: state.data.map((item) =>
          item.id === action.payload.id
            ? { ...item, status: action.payload.status, remark: action.payload.remark }
            : item,
        ),
        showForm: false,
        selectedItem: null,
      };

    default:
      return state;
  }
};

const initialState: TableState = {
  data: [],
  pagination: {
    current: WALLET_SETTING_CONSTANTS.DEFAULT_PAGE,
    pageSize: WALLET_SETTING_CONSTANTS.PAGE_SIZE,
    total: 0,
  },
  filters: {
    status: 'all',
    search: '',
  },
  selectedItem: null,
  showForm: false,
};

interface UseWalletSettingProps {
  userId?: string;
}

export const useWalletSetting = ({ userId = 'current-user' }: UseWalletSettingProps = {}) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.walletSetting);

  const [state, dispatchTable] = useReducer(tableReducer, initialState);

  const convertToTableData = (depositRequest: any): WalletSettingTableData => ({
    ...depositRequest,
    key: depositRequest.id,
  });

  const fetchData = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(clearError());

    try {
      const useCase = walletSettingContainer.get<IGetDepositRequestsPaginatedUseCase>(
        WALLET_SETTING_TYPES.IGetDepositRequestsPaginatedUseCase,
      );

      const actualStatus =
        state.filters.status === 'all' ? DepositRequestStatus.Requested : state.filters.status;

      const response = await useCase.execute(
        userId,
        actualStatus,
        state.pagination.current,
        state.pagination.pageSize,
      );

      const tableData = response.data.items.map(convertToTableData);

      dispatchTable({ type: 'SET_DATA', payload: tableData });
      dispatchTable({
        type: 'SET_PAGINATION',
        payload: {
          current: response.data.page,
          pageSize: response.data.pageSize,
          total: response.data.total,
        },
      });

      dispatch(setLoading(false));
    } catch (error: any) {
      console.error('Error fetching data:', error);
      dispatch(setError(error.message || 'Failed to fetch deposit requests'));
      dispatchTable({ type: 'SET_DATA', payload: [] });
      dispatchTable({
        type: 'SET_PAGINATION',
        payload: { ...state.pagination, total: 0 },
      });
      dispatch(setLoading(false));
    }
  }, [dispatch, userId, state.filters.status, state.pagination.current, state.pagination.pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = useCallback(() => {
    if (!state.filters.search) return state.data;

    return state.data.filter(
      (item) =>
        item.refCode.toLowerCase().includes(state.filters.search.toLowerCase()) ||
        item.userId.toLowerCase().includes(state.filters.search.toLowerCase()),
    );
  }, [state.data, state.filters.search]);

  const setSearch = useCallback((search: string) => {
    dispatchTable({ type: 'SET_SEARCH', payload: search });
  }, []);

  const setStatus = useCallback((status: DepositRequestStatus | 'all') => {
    dispatchTable({ type: 'SET_STATUS', payload: status });
  }, []);

  const setPage = useCallback((page: number) => {
    dispatchTable({ type: 'SET_PAGE', payload: page });
  }, []);

  const handleView = useCallback(
    (id: string) => {
      const item = state.data.find((d) => d.id === id);
      if (item) {
        dispatchTable({ type: 'SET_SELECTED_ITEM', payload: item });
        dispatchTable({ type: 'SET_SHOW_FORM', payload: true });
      }
    },
    [state.data],
  );

  const handleApprove = useCallback(
    async (id: string, remark?: string) => {
      dispatch(setLoading(true));
      try {
        // TODO: Implement actual API call for approve
        await new Promise((resolve) => setTimeout(resolve, 500));

        dispatchTable({
          type: 'UPDATE_ITEM_STATUS',
          payload: { id, status: DepositRequestStatus.Approved, remark },
        });

        dispatch(setLoading(false));
      } catch (error: any) {
        console.error('Error approving request:', error);
        dispatch(setError(error.message || 'Failed to approve request'));
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const handleReject = useCallback(
    async (id: string, remark?: string) => {
      dispatch(setLoading(true));
      try {
        // TODO: Implement actual API call for reject
        await new Promise((resolve) => setTimeout(resolve, 500));

        dispatchTable({
          type: 'UPDATE_ITEM_STATUS',
          payload: { id, status: DepositRequestStatus.Rejected, remark },
        });

        dispatch(setLoading(false));
      } catch (error: any) {
        console.error('Error rejecting request:', error);
        dispatch(setError(error.message || 'Failed to reject request'));
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const closeForm = useCallback(() => {
    dispatchTable({ type: 'SET_SHOW_FORM', payload: false });
    dispatchTable({ type: 'SET_SELECTED_ITEM', payload: null });
  }, []);

  const clearErrorHandler = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    data: filteredData(),
    loading,
    error,
    pagination: state.pagination,
    search: state.filters.search,
    status: state.filters.status,
    selectedItem: state.selectedItem,
    showForm: state.showForm,
    setSearch,
    setStatus,
    setPage,
    handleView,
    handleApprove,
    handleReject,
    handleRefresh,
    closeForm,
    clearError: clearErrorHandler,
  };
};
