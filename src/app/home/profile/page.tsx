'use client';

import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

const AccountProfilePage = dynamic(
  () => import('@/features/home/module/account/profile/AccountProfilePage'),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <AccountProfilePage />;
};

export default page;
