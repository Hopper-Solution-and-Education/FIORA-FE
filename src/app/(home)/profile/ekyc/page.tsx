'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const KYCPage = dynamic(() => import('@/features/profile/modules'), {
  loading: () => <Loading />,
});

const page = () => {
  return <KYCPage />;
};

export default page;
