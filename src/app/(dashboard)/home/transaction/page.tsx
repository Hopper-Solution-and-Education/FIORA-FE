import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const TransactionPage = dynamic(
  () => import('@/features/home/module/transaction/TransactionPage'),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <TransactionPage />;
};

export default page;
