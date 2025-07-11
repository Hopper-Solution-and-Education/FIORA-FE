'use client';

import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

const FaqDetailPageRender = dynamic(
  () => import('@/features/faqs/presentation/pages/FaqDetailPage'),
  {
    loading: () => <Loading />,
    ssr: true,
  },
);

const FaqDetailPage = () => {
  const { id } = useParams() as { id: string };

  return <FaqDetailPageRender id={id} />;
};

export default FaqDetailPage;
