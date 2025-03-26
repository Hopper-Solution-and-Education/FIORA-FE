'use client';
import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

const LandingPageRender = dynamic(() => import('@/features/landing/presentation/LandingPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const Page = () => {
  return <LandingPageRender />;
};

export default Page;
