'use client';

import Loading from '@/components/common/atoms/Loading';
import { Session, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const LandingPage = dynamic(() => import('@/features/setting/module/landing/presentation/Page'), {
  loading: () => <Loading />,
});

const Page = () => {
  const { data: session, status } = useSession() as { data: Session | null; status: string };

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session?.user?.role || session.user.role !== 'Admin') {
    notFound();
  }

  return <LandingPage />;
};

export default Page;
