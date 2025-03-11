'use client';

import dynamic from 'next/dynamic';

const BannerPage = dynamic(() => import('@/features/admin/banner/presentation/Page'), {
  loading: () => <div>Loading...</div>,
});

const page = () => {
  return <BannerPage />;
};

export default page;
