'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const EditAboutUsPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/EditAboutUsPage'),
  {
    loading: () => <Loading />,
    ssr: true,
  },
);

export default function Page() {
  return <EditAboutUsPageRender />;
}
