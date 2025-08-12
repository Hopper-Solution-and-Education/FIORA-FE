'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const FaqsImportPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/FaqsImportPage'),
  {
    loading: () => <Loading />,
  },
);

export default function Page() {
  return <FaqsImportPageRender />;
}
