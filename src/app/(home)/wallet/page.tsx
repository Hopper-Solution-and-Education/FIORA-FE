'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const WalletDashboardRender = dynamic(
  () => import('@/features/home/module/wallet/presentation/pages/WalletDashboardPage'),
  {
    loading: () => <Loading />,
  },
);

const WalletPage = () => {
  return <WalletDashboardRender />;
};

export default WalletPage;
