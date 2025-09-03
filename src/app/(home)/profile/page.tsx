'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const ProfilePage = dynamic(
  () => import('@/features/profile/presentation/modules/profile/pages/ProfilePage'),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <ProfilePage />;
};

export default page;
