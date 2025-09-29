'use client';

import { useFlexiInterestCronjobDashboard } from '../hooks/useFlexiInterestCronjobDashboard';
import FlexiInterestCronJobChart from '../organisms/FlexiInterestCronJobChart';
import FlexiInterestCronJobTable from '../organisms/FlexiInterestCronJobTable';
import { useGetOptionsQuery } from '../services/flexi-interest.service';

function FlexiInterestCronjobDashboardPage() {
  const { tableData, loadMore, loading, updateRowItem } = useFlexiInterestCronjobDashboard();
  const { data: dataFilterOptions } = useGetOptionsQuery();

  return (
    <section>
      <div>
        {/* <FlexiInterestCronJobChartSample /> */}
        <FlexiInterestCronJobChart />
      </div>
      <div className="my-6"></div>
      <div className="space-y-4 mx-4 border p-4 rounded-2xl" id="flexi-interest-table-container">
        <FlexiInterestCronJobTable
          extraData={tableData.extraData}
          data={tableData.data}
          loading={loading}
          hasMore={tableData.hasMore}
          isLoadingMore={tableData.isLoadingMore}
          onLoadMore={loadMore}
          onUpdateRowItem={updateRowItem}
          dataFilterOptions={dataFilterOptions}
        />
      </div>
    </section>
  );
}

export default FlexiInterestCronjobDashboardPage;
