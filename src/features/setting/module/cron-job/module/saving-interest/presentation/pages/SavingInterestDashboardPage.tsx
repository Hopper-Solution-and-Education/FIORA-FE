'use client';

import { useSavingInterestDashboard } from '@/features/setting/module/cron-job/module/saving-interest/presentation/hooks/useSavingInterestDashboard';
import SavingInterestChart from '@/features/setting/module/cron-job/module/saving-interest/presentation/organisms/SavingInterestChart';
import SavingInterestCommonTable from '@/features/setting/module/cron-job/module/saving-interest/presentation/organisms/SavingInterestCommonTable';
import { setMembershipTierFilter } from '@/features/setting/module/cron-job/module/saving-interest/slices';
import { useAppDispatch } from '@/store';

const SavingInterestDashboardPage = () => {
  const dispatch = useAppDispatch();
  const {
    // Table data
    tableData,
    data,
    loading,
    totalItems,
    hasMore,
    isLoadingMore,

    // Chart data
    chartData,
    chartLoading,

    // Actions
    fetchData,
    loadMore,
  } = useSavingInterestDashboard();

  // Data fetching is handled by useSavingInterestDashboard hook
  // No need for additional useEffect here as it causes duplicate API calls

  // Handle bar chart click to filter table by tierName
  const handleBarClick = (tierName: string) => {
    dispatch(setMembershipTierFilter([tierName]));
  };

  // Wrapper for fetchData to match expected signature
  const handleRetrySuccess = () => {
    fetchData(1, 20, false);
  };

  return (
    <section className="sm:px-6 lg:px-8">
      <div className="space-y-6 mb-12">
        {/* Chart Section */}
        <SavingInterestChart
          chartData={chartData}
          loading={chartLoading}
          onBarClick={handleBarClick}
        />

        {/* Table Section */}
        <div className="border rounded-2xl p-6">
          <SavingInterestCommonTable
            data={tableData.data}
            loading={loading}
            hasMore={tableData.hasMore}
            isLoadingMore={tableData.isLoadingMore}
            onLoadMore={loadMore}
            onRetrySuccess={handleRetrySuccess}
          />
        </div>
      </div>
    </section>
  );
};

export default SavingInterestDashboardPage;
