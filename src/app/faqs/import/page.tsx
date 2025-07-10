'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const FaqsImportPageRender = dynamic(
  () => import('@/features/faqs/presentation/pages/FaqsImportPage'),
  {
    loading: () => <Loading />,
  },
);

const FaqsImportPage = () => {
  return <FaqsImportPageRender />;
};

export default FaqsImportPage;
