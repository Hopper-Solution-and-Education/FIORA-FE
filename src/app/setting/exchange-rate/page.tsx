'use client';

import Loading from '@/components/common/atoms/Loading';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const ExchangeRateSettingPage = dynamic(() => import('@/features/setting/module/exchange-rate'), {
  loading: () => <Loading />,
});

const Page = () => {
  const { status } = useSession() as { data: Session | null; status: string };

  if (status === 'loading') {
    return <Loading />;
  }

  return <ExchangeRateSettingPage />;
};

export default Page;
