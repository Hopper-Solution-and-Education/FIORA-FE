'use client';

import { useFlexiInterestCronjobDashboard } from '../hooks/useFlexiInterestCronjobDashboard';
import { useFlexiInterestStatistics } from '../hooks/useFlexiInterestStatistics';
import FlexiInterestCronJobChart from '../organisms/FlexiInterestCronJobChart';
import FlexiInterestCronJobTable from '../organisms/FlexiInterestCronJobTable';

function FlexiInterestCronjobDashboardPage() {
  const { tableData, loadMore, loading } = useFlexiInterestCronjobDashboard();
  const { statistics, loading: chartLoading } = useFlexiInterestStatistics();

  return (
    <section>
      <div className="space-y-4 mx-4 border p-4 rounded-2xl">
        {/* <FlexiInterestCronJobChartSample /> */}
        {statistics && <FlexiInterestCronJobChart data={statistics} loading={chartLoading} />}
      </div>
      <div className="my-6"></div>
      <div className="space-y-4 mx-4 border p-4 rounded-2xl">
        <FlexiInterestCronJobTable
          extraData={tableData.extraData}
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
