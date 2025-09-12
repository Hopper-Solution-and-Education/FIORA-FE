'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const EditNewsPageRender = dynamic(
  () => import('@/features/news/presentation/pages/EditNewsPage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

export default function Page() {
  return <EditNewsPageRender />;
}
