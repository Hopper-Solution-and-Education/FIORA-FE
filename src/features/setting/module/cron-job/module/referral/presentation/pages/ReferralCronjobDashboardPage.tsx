'use client';

import { useReferralCronjobDashboard } from '@/features/setting/module/cron-job/module/referral/presentation/hooks/useReferralCronjobDashboard';
import ReferralCronjobChart from '@/features/setting/module/cron-job/module/referral/presentation/organisms/ReferralCronjobChart';
import ReferralCronjobCommonTable from '@/features/setting/module/cron-job/module/referral/presentation/organisms/ReferralCronjobCommonTable';
import { ReferralCronjobTableData } from '@/features/setting/module/cron-job/module/referral/presentation/types/referral.type';
import { setTypeOfBenefitFilter } from '@/features/setting/module/cron-job/module/referral/slices';
import { useAppDispatch } from '@/store';
import { useEffect, useMemo } from 'react';

const ReferralCronjobDashboardPage = () => {
  const dispatch = useAppDispatch();
  const {
    // Table data
    data,
    loading,
    isLoadingMore,
    hasMore,
    totalItems,

    // Chart data
    chartData,
    chartLoading,

    // Actions
    fetchData,
    loadMore,
  } = useReferralCronjobDashboard();

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

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
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
            totalItems={statistics.total}
            successfulCount={statistics.successful}
            failedCount={statistics.failed}
          />
        </div>
      </div>
    </section>
  );
};

export default ReferralCronjobDashboardPage;
