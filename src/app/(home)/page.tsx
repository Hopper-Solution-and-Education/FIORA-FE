'use client';

import Loading from '@/components/common/atoms/Loading';
import HomePage from '@/features/home/module/home/HomePage';
import LandingPage from '@/features/landing/presentation/pages/LandingPage';
import { useSession } from 'next-auth/react';

const Page = () => {
  const { data, status } = useSession();
  const isLoggedIn = !!data?.user;

  if (status === 'loading') {
    return <Loading />;
  }

  return isLoggedIn ? <HomePage /> : <LandingPage />;
};

export default Page;
