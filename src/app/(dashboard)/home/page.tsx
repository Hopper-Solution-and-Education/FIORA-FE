import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('@/features/home/module/home/HomePage'), {
  loading: () => <Loading />,
});

const page = () => {
  return <HomePage />;
};

export default page;
