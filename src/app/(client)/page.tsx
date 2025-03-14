import Loading from '@/components/common/loading';
import dynamic from 'next/dynamic';

const LandingPageRender = dynamic(() => import('@/features/landing/presentation/LandingPage'), {
  loading: () => <Loading />,
});

function page() {
  return <LandingPageRender />;
}

export default page;
