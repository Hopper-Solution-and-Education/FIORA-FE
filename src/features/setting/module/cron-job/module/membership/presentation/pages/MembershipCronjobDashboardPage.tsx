'use client';

import { DispatchTableProvider } from '../context/DispatchTableContext';
import { TableProvider } from '../context/TableContext';
import { useMembershipCronjobDashboard } from '../hooks/useMembershipCronjobDashboard';
import { MembershipTopBarAction } from '../molecules';
import MembershipCronjobChart from '../organisms/MembershipCronjobChart';
import MembershipCronjobCommonTable from '../organisms/MembershipCronjobCommonTable';

const STORAGE_KEY = 'membership-cronjob:table-config';

const MembershipCronjobDashboardPage = () => {
  const { tableData, loading, loadMore, dispatchTable } = useMembershipCronjobDashboard();

  console.log('tableData', tableData);

  return (
    <DispatchTableProvider value={{ dispatchTable }}>
      <TableProvider value={{ table: tableData }}>
        <section className="container mx-auto sm:px-6 lg:px-8">
          <div className="space-y-6 mb-12">
            <MembershipCronjobChart />

            <div className="space-y-4 border p-4 rounded-2xl">
              {/* Top bar with search and filters */}
              <MembershipTopBarAction />

              {/* Table component */}
              <MembershipCronjobCommonTable
                data={tableData.data}
                loading={loading}
                hasMore={tableData.hasMore}
                isLoadingMore={tableData.isLoadingMore}
                onLoadMore={loadMore}
              />
            </div>
          </div>
        </section>
      </TableProvider>
    </DispatchTableProvider>
  );
};

export default MembershipCronjobDashboardPage;
