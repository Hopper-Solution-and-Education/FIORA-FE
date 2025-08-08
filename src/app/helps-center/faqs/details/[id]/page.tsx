'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const FaqDetailPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/FaqDetailPage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

const FaqDetailPage = () => {
  return <FaqDetailPageRender />;
};

export default FaqDetailPage;
