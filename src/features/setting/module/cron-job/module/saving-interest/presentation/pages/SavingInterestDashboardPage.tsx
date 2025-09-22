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
    data,
    loading,
    totalItems,

    // Chart data
    chartData,
    chartLoading,

    // Actions
    fetchData,
  } = useSavingInterestDashboard();

  // Data fetching is handled by useSavingInterestDashboard hook
  // No need for additional useEffect here as it causes duplicate API calls

  // Handle bar chart click to filter table by membershipTier
  const handleBarClick = (membershipTier: string) => {
    dispatch(setMembershipTierFilter([membershipTier]));
  };

  return (
    <section className="sm:px-6 lg:px-8">
      <div className="space-y-6 mb-12">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Cron Job Smart Saving Management
          </h1>
        </div>

        {/* Chart Section */}
        <SavingInterestChart
          chartData={chartData}
          loading={chartLoading}
          onBarClick={handleBarClick}
        />

        {/* Table Section */}
        <div className="border rounded-2xl p-6">
          <SavingInterestCommonTable data={data} loading={loading} onRetrySuccess={fetchData} />
        </div>
      </div>
    </section>
  );
};

export default SavingInterestDashboardPage;
