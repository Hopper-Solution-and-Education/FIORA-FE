'use client';

import { useFlexiInterestCronjobDashboard } from '../hooks/useFlexiInterestCronjobDashboard';
import FlexiInterestCronJobTable from '../organisms/FlexiInterestCronJobTable';

function FlexiInterestCronjobDashboardPage() {
  const { tableData, loadMore, loading } = useFlexiInterestCronjobDashboard();

  return (
    <section>
      <div className="space-y-4 mx-4 border p-4 rounded-2xl">
        <FlexiInterestCronJobTable
          data={tableData.data}
          loading={loading}
          hasMore={tableData.hasMore}
          isLoadingMore={tableData.isLoadingMore}
          onLoadMore={loadMore}
        />
      </div>
    </section>
  );
}

export default FlexiInterestCronjobDashboardPage;
