'use client';

import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

const BannerPage = dynamic(
  () => import('@/features/setting/module/landing/landing/presentation/Page'),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <BannerPage />;
};

export default page;
