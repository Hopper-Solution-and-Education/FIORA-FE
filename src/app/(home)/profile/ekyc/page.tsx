import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const KYCPage = dynamic(() => import('@/features/profile/presentation/modules/eKyc'), {
  loading: () => <Loading />,
});

const page = () => {
  return <KYCPage />;
};

export default page;
