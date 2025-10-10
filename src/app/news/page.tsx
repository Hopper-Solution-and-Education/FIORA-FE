'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const NewsPageRender = dynamic(() => import('@/features/news/presentation/pages/NewsListPage'), {
  loading: () => <Loading />,
});

const NewsPage = () => {
  return <NewsPageRender />;
};

export default NewsPage;
