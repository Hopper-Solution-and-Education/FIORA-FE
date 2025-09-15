'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const WalletPaymentPage = dynamic(
  () => import('@/features/payment-wallet/presentation/pages').then((mod) => mod.PaymentWalletPage),
  {
    loading: () => <Loading />,
  },
);

const PaymentWalletPage = () => {
  return <WalletPaymentPage />;
};

export default PaymentWalletPage;
