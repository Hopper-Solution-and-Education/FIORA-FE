'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { useCallback, useEffect } from 'react';
import { setColumnConfig, setNotificationDashboardFilter } from '../../slices';
import { fetchFilterOptionsAsyncThunk } from '../../slices/actions';
import { loadColumnConfigFromStorage } from '../../slices/persist';
import { NotificationDashboardFilterState } from '../../slices/types';
import { DispatchTableProvider } from '../context/DispatchTableContext';
import { TableProvider } from '../context/TableContext';
import { useNotificationDashboard } from '../hooks/useNotificationDashboard';
import NotificationDashboardTable from '../organisms/NotificationDashboardTable';
import NotificationDashboardTopBarAction from '../organisms/NotificationDashboardTopBarAction';
import NotificationDashboardLayout from './NotificationDashboardLayout';

const NotificationDashboardPage = () => {
  const { tableData, loading, loadMore, dispatchTable } = useNotificationDashboard();

  const filter = useAppSelector((state) => state.notificationDashboard.filter);
  const search = filter.search || '';
  const dispatch = useAppDispatch();

  useEffect(() => {
    const config = loadColumnConfigFromStorage();
    if (config) {
      dispatch(setColumnConfig(config));
    }

    dispatch(fetchFilterOptionsAsyncThunk());
  }, [dispatch]);

  const handleFilterChange = useCallback(
    (newFilter: NotificationDashboardFilterState) => {
      dispatch(setNotificationDashboardFilter(newFilter));
    },
    [dispatch],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      dispatch(setNotificationDashboardFilter({ ...filter, search: value }));
    },
    [dispatch, filter],
  );

  return (
    <DispatchTableProvider value={{ dispatchTable }}>
      <TableProvider value={{ table: tableData }}>
        <NotificationDashboardLayout>
          <div className="space-y-6 border p-4 rounded-2xl mb-12">
            <NotificationDashboardTopBarAction
              filter={filter}
              onFilterChange={handleFilterChange}
              search={search}
              onSearchChange={handleSearchChange}
            />

            <NotificationDashboardTable
              data={tableData.data}
              loading={loading}
              hasMore={tableData.hasMore}
              isLoadingMore={tableData.isLoadingMore}
              onLoadMore={loadMore}
            />
          </div>
        </NotificationDashboardLayout>
      </TableProvider>
    </DispatchTableProvider>
  );
};

export default NotificationDashboardPage;
