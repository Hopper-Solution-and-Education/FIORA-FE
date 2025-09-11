'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const MembershipCronjobDashboardPage = dynamic(
  () =>
    import(
      '@/features/setting/module/cron-job/module/membership/presentation/pages/MembershipCronjobDashboardPage'
    ),
  { loading: () => <Loading /> },
);

export default function Page() {
  return <MembershipCronjobDashboardPage />;
}
