'use client';

import Loading from '@/components/common/atoms/Loading';
import { Session, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

const BannerPage = dynamic(() => import('@/features/setting/module/landing/presentation/Page'), {
  loading: () => <Loading />,
});

const Page = () => {
  const { data: session } = useSession() as { data: Session | null };

  if (!session?.user?.role || session.user.role !== 'Admin') {
    notFound();
  }

  return <BannerPage />;
};

export default Page;
