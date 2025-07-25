/* eslint-disable react-hooks/exhaustive-deps */
import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect, useReducer, useRef } from 'react';
import { notificationDashboardContainer } from '../../di/notificationDashboardDIContainer';
import { NOTIFICATION_DASHBOARD_TYPES } from '../../di/notificationDashboardDIContainer.type';
import { IGetNotificationsPaginatedUseCase } from '../../domain/usecase/GetNotificationsPaginatedUseCase';
import { setLoading } from '../../slices';
import { NotificationDashboardTableData } from '../types/setting.type';
import { initialState, tableReducer } from '../types/tableReducer.type';

function cleanFilter(filter: Record<string, any>) {
  const result: Record<string, any> = {};
  for (const key in filter) {
    if (filter[key] !== null) result[key] = filter[key];
  }
  return result;
}

// Utility: convert Notification -> NotificationDashboardTableData
function convertToTableData(item: any): NotificationDashboardTableData {
  return {
    id: item.id,
    sendDate: item.sendDate,
    notifyTo: item.notifyTo,
    subject: item.subject,
    recipients: item.recipients,
    sender: item.sender,
    notifyType: item.notifyType,
    channel: item.channel,
    status: item.status,
    key: item.id,
  };
}

export const useNotificationDashboard = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.notificationDashboard);

  const [state, dispatchTable] = useReducer(tableReducer, initialState);
  const isInitialLoad = useRef(true);
  const isFetching = useRef(false);

  const fetchData = useCallback(
    async (page: number, pageSize: number, isLoadMore = false) => {
      if (isFetching.current) return;
      isFetching.current = true;

      if (isLoadMore) {
        dispatchTable({ type: 'SET_IS_LOADING_MORE', payload: true });
      } else {
        dispatch(setLoading(true));
      }

      try {
        const useCase = notificationDashboardContainer.get<IGetNotificationsPaginatedUseCase>(
          NOTIFICATION_DASHBOARD_TYPES.IGetNotificationsPaginatedUseCase,
        );
        const clean = cleanFilter(filter);
        const response = await useCase.execute(page, pageSize, clean);

        const tableData = response.items.map(convertToTableData);

        if (isLoadMore) {
          dispatchTable({ type: 'APPEND_DATA', payload: tableData });
        } else {
          dispatchTable({ type: 'SET_DATA', payload: tableData });
        }

        dispatchTable({
          type: 'SET_PAGINATION',
          payload: {
            current: response.page,
            pageSize: response.pageSize,
            total: response.total ?? 0,
          },
        });

        const hasMore =
          response.page <
          (response.totalPage ?? Math.ceil((response.total ?? 0) / response.pageSize));
        dispatchTable({ type: 'SET_HAS_MORE', payload: hasMore });
      } finally {
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
