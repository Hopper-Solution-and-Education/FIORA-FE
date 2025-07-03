'use client';
import Loading from '@/components/common/atoms/Loading';
import { Session, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

const FaqsImportPageRender = dynamic(
  () => import('@/features/faqs/presentation/pages/FaqsImportPage'),
  {
    loading: () => <Loading />,
  },
);

const FaqsImportPage = () => {
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    if (session?.user?.role !== 'Admin' && session?.user?.role !== 'CS') {
      redirect('/');
    }
  }, [session]);
  return <FaqsImportPageRender />;
};

export default FaqsImportPage;
