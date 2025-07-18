'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const LandingPage = dynamic(
  () => import('@/features/setting/module/landing/presentation/pages/LandingSettingPage'),
  {
    loading: () => <Loading />,
  },
);

const Page = () => {
  return <LandingPage />;
};

export default Page;
