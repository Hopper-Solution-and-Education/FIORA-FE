'use client';

import { useReferralCronjobDashboard } from '@/features/setting/module/cron-job/module/referral/presentation/hooks/useReferralCronjobDashboard';
import ReferralCronjobChart from '@/features/setting/module/cron-job/module/referral/presentation/organisms/ReferralCronjobChart';
import ReferralCronjobCommonTable from '@/features/setting/module/cron-job/module/referral/presentation/organisms/ReferralCronjobCommonTable';
import { ReferralCronjobTableData } from '@/features/setting/module/cron-job/module/referral/presentation/types/referral.type';
import { setTypeOfBenefitFilter } from '@/features/setting/module/cron-job/module/referral/slices';
import { useAppDispatch } from '@/store';
import { useMemo } from 'react';

const ReferralCronjobDashboardPage = () => {
  const dispatch = useAppDispatch();
  const {
    // Table data
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
  } = useReferralCronjobDashboard();

  // Data fetching is handled by useReferralCronjobDashboard hook
  // No need for additional useEffect here as it causes duplicate API calls

  // Calculate statistics dynamically from data
  const statistics = useMemo(() => {
    const total = totalItems;
    const successful =
      data?.filter((item: ReferralCronjobTableData) => item.status === 'successful').length || 0;
    const failed =
      data?.filter((item: ReferralCronjobTableData) => item.status === 'fail').length || 0;

    return {
      total,
      successful,
      failed,
    };
  }, [data, totalItems]);

  // Handle bar chart click to filter table by typeOfBenefit
  const handleBarClick = (typeOfBenefit: string) => {
    dispatch(setTypeOfBenefitFilter([typeOfBenefit]));
  };

  return (
    <section className="sm:px-6 lg:px-8">
      <div className="space-y-6 mb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Cron Job Referral Management
          </h1>
        </div>

        {/* Chart Section */}
        <ReferralCronjobChart
          chartData={chartData}
          loading={chartLoading}
          onBarClick={handleBarClick}
        />

        {/* Table Section */}
        <div className="border rounded-2xl p-6">
          <ReferralCronjobCommonTable
            data={data}
            loading={loading}
            totalItems={statistics.total}
            successfulCount={statistics.successful}
            failedCount={statistics.failed}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
            onRetrySuccess={() => fetchData(1, 10, false)}
          />
        </div>
      </div>
    </section>
  );
};

export default ReferralCronjobDashboardPage;
