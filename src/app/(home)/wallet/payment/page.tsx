'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const WalletPaymentDetailsPage = dynamic(
  () =>
    import('@/features/home/module/wallet/presentation/pages').then((mod) => mod.WalletDetailsPage),
  {
    loading: () => <Loading />,
  },
);

const WalletPaymentPage = () => {
  return <WalletPaymentDetailsPage />;
};

export default WalletPaymentPage;
