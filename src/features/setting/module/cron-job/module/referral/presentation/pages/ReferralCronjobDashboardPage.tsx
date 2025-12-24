'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReferralCronjobDashboard } from '@/features/setting/module/cron-job/module/referral/presentation/hooks/useReferralCronjobDashboard';
import CampaignSettingsForm from '@/features/setting/module/cron-job/module/referral/presentation/organisms/CampaignSettingsForm';
import ReferralCronjobChart from '@/features/setting/module/cron-job/module/referral/presentation/organisms/ReferralCronjobChart';
import ReferralCronjobCommonTable from '@/features/setting/module/cron-job/module/referral/presentation/organisms/ReferralCronjobCommonTable';
import { ReferralCronjobTableData } from '@/features/setting/module/cron-job/module/referral/presentation/types/referral.type';
import { setTypeOfBenefitFilter } from '@/features/setting/module/cron-job/module/referral/slices';
import { useAppDispatch } from '@/store';
import { useMemo, useState } from 'react';

enum REFFERAL_TAB {
  DASHBOARD = 'dashboard',
  SETTING = 'setting',
}

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
  const [tab, setTab] = useState<REFFERAL_TAB>(REFFERAL_TAB.DASHBOARD);

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
      <Tabs value={tab} onValueChange={(value) => setTab(value as REFFERAL_TAB)} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value={REFFERAL_TAB.DASHBOARD}>Dashboard</TabsTrigger>
          <TabsTrigger value={REFFERAL_TAB.SETTING}>Settings</TabsTrigger>
        </TabsList>

        <TabsContent value={REFFERAL_TAB.DASHBOARD}>
          <div className="space-y-6 mb-12">
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
        </TabsContent>

        <TabsContent value={REFFERAL_TAB.SETTING}>
          <div className="space-y-6 mb-12">
            <CampaignSettingsForm onBack={() => setTab(REFFERAL_TAB.DASHBOARD)} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default ReferralCronjobDashboardPage;
