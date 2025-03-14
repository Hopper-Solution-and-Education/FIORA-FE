'use client';

import Loading from '@/components/common/loading';
import dynamic from 'next/dynamic';

const BannerPage = dynamic(() => import('@/features/dashboard/module/banner/BannerPage'), {
  loading: () => <Loading />,
});

const page = () => {
  return <BannerPage />;
};

export default page;
