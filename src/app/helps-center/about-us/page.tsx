'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const AboutUsPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/AboutUsPage'),
  {
    loading: () => <Loading />,
  },
);

const AboutUsPage = () => {
  return <AboutUsPageRender />;
};

export default AboutUsPage;
