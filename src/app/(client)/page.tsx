'use client';
import Loading from '@/components/common/atoms/Loading';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

const LandingPageRender = dynamic(() => import('@/features/landing/presentation/LandingPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const Page = () => {
  const { data } = useSession();
  if (data) {
    redirect('/home');
  }

  return <LandingPageRender />;
};

export default Page;
