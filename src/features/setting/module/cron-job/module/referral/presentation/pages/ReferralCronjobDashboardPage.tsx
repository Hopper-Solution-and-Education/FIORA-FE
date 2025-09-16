'use client';

import { useReferralCronjobDashboard } from '@/features/setting/module/cron-job/module/referral/presentation/hooks/useReferralCronjobDashboard';
import ReferralCronjobChart from '@/features/setting/module/cron-job/module/referral/presentation/organisms/ReferralCronjobChart';
import ReferralCronjobCommonTable from '@/features/setting/module/cron-job/module/referral/presentation/organisms/ReferralCronjobCommonTable';
import { useEffect, useMemo } from 'react';

const ReferralCronjobDashboardPage = () => {
  const {
    // Table data
    data,
    loading,
    paginationLoading,
    currentPage,
    pageSize,
    totalPages,
    totalItems,

    // Chart data
    chartData,
    chartLoading,

    // Actions
    fetchData,
    handlePageChange,
  } = useReferralCronjobDashboard();

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Calculate statistics dynamically from data
  const statistics = useMemo(() => {
    const total = totalItems;
    const successful = data?.filter((item: any) => item.status === 'successful').length || 0;
    const failed = data?.filter((item: any) => item.status === 'fail').length || 0;

    return {
      total,
      successful,
      failed,
      showCount: pageSize,
    };
  }, [data, pageSize, totalItems]);

  return (
    <section className="sm:px-6 lg:px-8">
      <div className="space-y-6 mb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Cron Job Referral Management</h1>
        </div>

        {/* Chart Section */}
        <ReferralCronjobChart chartData={chartData} loading={chartLoading} />

        {/* Table Section */}
        <div className="border rounded-2xl p-6">
          <ReferralCronjobCommonTable
            data={data}
            loading={loading}
            paginationLoading={paginationLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
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
