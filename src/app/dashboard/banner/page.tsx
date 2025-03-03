'use client';

import dynamic from 'next/dynamic';

const BannerPage = dynamic(() => import('@/features/dashboard/module/banner/BannerPage'), {
  loading: () => <div>Loading...</div>,
});

const page = () => {
  return <BannerPage />;
};

export default page;
