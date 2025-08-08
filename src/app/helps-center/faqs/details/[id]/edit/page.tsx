'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const EditFaqPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/EditFaqPage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

export default function Page() {
  return <EditFaqPageRender />;
}
