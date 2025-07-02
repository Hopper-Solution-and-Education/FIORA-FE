'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const WalletDepositRender = dynamic(
  () =>
    import('@/features/home/module/wallet/presentation/module/client/pages').then(
      (mod) => mod.WalletDepositPage,
    ),
  {
    loading: () => <Loading />,
  },
);

const WalletDepositPage = () => {
  return <WalletDepositRender />;
};

export default WalletDepositPage;
