import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const VerifyKYCPage = dynamic(() => import('@/features/profile/presentation/modules/eKyc/verify'), {
  loading: () => <Loading />,
});

const page = () => {
  return <VerifyKYCPage />;
};

export default page;
