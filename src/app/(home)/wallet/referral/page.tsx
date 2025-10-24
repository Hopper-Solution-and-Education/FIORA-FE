'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const ReferralUIPage = dynamic(
  () => import('@/features/referral/presentation/pages/ReferralUIPage'),
  {
    loading: () => <Loading />,
  },
);

const page = () => {
  return <ReferralUIPage />;
};

export default page;
