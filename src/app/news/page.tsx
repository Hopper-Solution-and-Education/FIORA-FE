'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const NewsPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/FaqsListPage'),
  {
    loading: () => <Loading />,
  },
);

const NewsPage = () => {
  return <NewsPageRender />;
};

export default NewsPage;
