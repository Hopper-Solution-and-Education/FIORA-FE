'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const TermsAndConditionsPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/TermsAndConditionsPage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

const TermsAndConditionsPage = () => {
  return <TermsAndConditionsPageRender />;
};

export default TermsAndConditionsPage;
