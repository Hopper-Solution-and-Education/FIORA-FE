'use client';

import { DispatchTableProvider } from '../context/DispatchTableContext';
import { TableProvider } from '../context/TableContext';
import { useMembershipCronjobDashboard } from '../hooks/useMembershipCronjobDashboard';
import MembershipCronjobChart from '../organisms/MembershipCronjobChart';
import MembershipCronjobCommonTable from '../organisms/MembershipCronjobCommonTable';

const STORAGE_KEY = 'membership-cronjob:table-config';

const MembershipCronjobDashboardPage = () => {
  const { tableData, loading, loadMore, dispatchTable } = useMembershipCronjobDashboard();

  return (
    <DispatchTableProvider value={{ dispatchTable }}>
      <TableProvider value={{ table: tableData }}>
        <section className="container mx-auto sm:px-6 lg:px-8">
          <div className="space-y-6 border p-4 rounded-2xl mb-12">
            <MembershipCronjobChart />
            <MembershipCronjobCommonTable
              data={tableData.data}
              loading={loading}
              hasMore={tableData.hasMore}
              isLoadingMore={tableData.isLoadingMore}
              onLoadMore={loadMore}
            />
          </div>
        </section>
      </TableProvider>
    </DispatchTableProvider>
  );
};

export default MembershipCronjobDashboardPage;
