'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const SavingInterestDashboardPage = dynamic(
  () =>
    import(
      '@/features/setting/module/cron-job/module/saving-interest/presentation/pages/SavingInterestDashboardPage'
    ),
  { loading: () => <Loading /> },
);

export default function Page() {
  return <SavingInterestDashboardPage />;
}
