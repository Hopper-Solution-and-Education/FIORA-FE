'use client';
import Loading from '@/components/common/atoms/Loading';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const LandingPageRender = dynamic(() => import('@/features/landing/presentation/LandingPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const Page = () => {
  const { data } = useSession();
  const isLoggedIn = data?.user;

  useEffect(() => {
    if (isLoggedIn) {
      redirect('/home');
    }
  }, [isLoggedIn]);

  return <LandingPageRender />;
};

export default Page;
