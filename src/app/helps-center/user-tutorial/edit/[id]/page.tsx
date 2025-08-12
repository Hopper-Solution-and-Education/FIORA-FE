'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const EditUserTutorialPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/EditUserTutorialPage'),
  {
    loading: () => <Loading />,
    ssr: true,
  },
);

export default function Page() {
  return <EditUserTutorialPageRender />;
}
