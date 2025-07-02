'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const WalletDashboardRender = dynamic(
  () =>
    import('@/features/home/module/wallet/presentation/module/client/pages').then(
      (mod) => mod.WalletDashboardPage,
    ),
  {
    loading: () => <Loading />,
  },
);

const WalletPage = () => {
  return <WalletDashboardRender />;
};

export default WalletPage;
