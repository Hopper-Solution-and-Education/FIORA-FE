'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const ContactUsPageRender = dynamic(
  () => import('@/features/helps-center/presentation/pages/ContactUsPage'),
  {
    loading: () => <Loading />,
  },
);

const ContactUsPage = () => {
  return <ContactUsPageRender />;
};

export default ContactUsPage;
