'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const FaqsPageRender = dynamic(() => import('@/features/faqs//FaqsPage'), {
  loading: () => <Loading />,
});

const FaqsPage = () => {
  return <FaqsPageRender />;
};

export default FaqsPage;
