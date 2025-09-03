'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const NewsDetailPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/FaqDetailPage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

const NewsDetailPage = () => {
  return <NewsDetailPageRender />;
};

export default NewsDetailPage;
