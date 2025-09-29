'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const CreateNewsPageRender = dynamic(
  () => import('@/features/news/presentation/pages/createNewsPage'),
  {
    loading: () => <Loading />,
    ssr: true,
  },
);

export default function Page() {
  return <CreateNewsPageRender />;
}
