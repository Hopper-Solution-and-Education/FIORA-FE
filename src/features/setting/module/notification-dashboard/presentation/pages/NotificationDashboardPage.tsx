'use client';

import { useAppDispatch } from '@/store';
import { useEffect } from 'react';
import { setColumnConfig } from '../../slices';
import { fetchFilterOptionsAsyncThunk } from '../../slices/actions';
import { loadColumnConfigFromStorage } from '../../slices/persist';
import { DispatchTableProvider } from '../context/DispatchTableContext';
import { TableProvider } from '../context/TableContext';
import { useNotificationDashboard } from '../hooks/useNotificationDashboard';
import NotificationDashboardTable from '../organisms/NotificationDashboardTable';
import NotificationDashboardTopBarAction from '../organisms/NotificationDashboardTopBarAction';
import NotificationDashboardLayout from './NotificationDashboardLayout';

/**
 * Main notification dashboard page component
 * Manages the overall layout and provides context for child components
 */
const NotificationDashboardPage = () => {
  // Custom hook that manages table data, loading states, and pagination
  const { tableData, loading, loadMore, dispatchTable } = useNotificationDashboard();
  const dispatch = useAppDispatch();

  // Initialize dashboard on component mount
  useEffect(() => {
    // Load saved column configuration from localStorage
    const config = loadColumnConfigFromStorage();

    if (config) {
      dispatch(setColumnConfig(config));
    }

    // Fetch filter options for dropdown menus
    dispatch(fetchFilterOptionsAsyncThunk());
  }, [dispatch]);

  return (
    // Context providers for table state management
    <DispatchTableProvider value={{ dispatchTable }}>
      <TableProvider value={{ table: tableData }}>
        <NotificationDashboardLayout>
          <div className="space-y-6 border p-4 rounded-2xl mb-12">
            {/* Self-contained top bar with search, filters, and column management */}
            <NotificationDashboardTopBarAction />

            {/* Table component with infinite scroll and loading states */}
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
