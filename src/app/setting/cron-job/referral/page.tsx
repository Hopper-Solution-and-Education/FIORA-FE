'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const ReferralCronjobDashboardPage = dynamic(
  () =>
    import(
      '@/features/setting/module/cron-job/module/referral/presentation/pages/ReferralCronjobDashboardPage'
    ),
  { loading: () => <Loading /> },
);

export default function Page() {
  return <ReferralCronjobDashboardPage />;
}
