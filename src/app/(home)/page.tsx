'use client';

import Loading from '@/components/common/atoms/Loading';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const LandingPageRender = dynamic(() => import('@/features/landing/presentation/LandingPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const HomePage = dynamic(() => import('@/features/home/module/home/HomePage'), {
  loading: () => <Loading />,
  ssr: false,
});

const Page = () => {
  const { data, status } = useSession();
  const isLoggedIn = !!data?.user;

  if (status === 'loading') {
    return <Loading />;
  }

  return isLoggedIn ? <HomePage /> : <LandingPageRender />;
};

export default Page;
