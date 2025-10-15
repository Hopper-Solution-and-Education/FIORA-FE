'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const SavingDashboardRender = dynamic(
  () =>
    import('@/features/home/module/saving/presentation/pages').then(
      (mod) => mod.SavingDashboardPage,
    ),
  {
    loading: () => <Loading />,
  },
);

function WalletDetail() {
  return <SavingDashboardRender />;
}

export default WalletDetail;
