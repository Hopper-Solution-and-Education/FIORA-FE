'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const EditFaqPageRender = dynamic(() => import('@/features/faqs/presentation/pages/EditFaqPage'), {
  loading: () => <Loading />,
  ssr: true,
});

export default function Page() {
  return <EditFaqPageRender />;
}
