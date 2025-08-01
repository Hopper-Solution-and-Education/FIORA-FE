'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const UserTutorialPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/UserTutorialPage'),
  {
    loading: () => <Loading />,
  },
);

const UserTutorialPage = () => {
  return <UserTutorialPageRender />;
};

export default UserTutorialPage;
