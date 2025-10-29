'use client';

import { useAppDispatch } from '@/store';
import { useEffect } from 'react';
import { setColumnConfig } from '../../slices';
import { fetchFilterOptionsAsyncThunk } from '../../slices/actions';
import { loadColumnConfigFromStorage } from '../../slices/persist';
import { DispatchTableProvider } from '../context/DispatchTableContext';
import { TableProvider } from '../context/TableContext';
import { useNotificationDashboard } from '../hooks/useNotificationDashboard';
import { NotificationDashboardCommonTable } from '../organisms';
import NotificationDashboardLayout from './NotificationDashboardLayout';

/**
 * Main notification dashboard page component
 * Manages the overall layout and provides context for child components
 */
const NotificationDashboardPage = () => {
  const { tableData, loading, loadMore, dispatchTable } = useNotificationDashboard();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const config = loadColumnConfigFromStorage();

    if (config) {
      dispatch(setColumnConfig(config));
    }

    dispatch(fetchFilterOptionsAsyncThunk());
  }, [dispatch]);

  return (
    <DispatchTableProvider value={{ dispatchTable }}>
      <TableProvider value={{ table: tableData }}>
        <NotificationDashboardLayout>
          <div className="space-y-6 border p-4 rounded-2xl mb-12">
            <NotificationDashboardCommonTable
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
