'use client';

import { useAppDispatch, useAppSelector } from '@/store';
import { setNotificationDashboardFilter } from '../../slices';
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

  const handleFilterChange = (newFilter: any) => {
    dispatch(setNotificationDashboardFilter(newFilter));
  };
  const handleApply = () => {
    // fetch sẽ tự động trigger qua useNotificationDashboard
  };
  const handleSearchChange = (value: string) => {
    dispatch(setNotificationDashboardFilter({ ...filter, search: value }));
  };

  return (
    <DispatchTableProvider value={{ dispatchTable }}>
      <TableProvider value={{ table: tableData }}>
        <NotificationDashboardLayout>
          <div className="space-y-6 border p-4 rounded-2xl mb-12">
            <NotificationDashboardTopBarAction
              filter={filter}
              onFilterChange={handleFilterChange}
              onApply={handleApply}
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
