'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const CreateFaqPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/CreateFaqPage'),
  {
    loading: () => <Loading />,
    ssr: true,
  },
);

export default function Page() {
  return <CreateFaqPageRender />;
}
