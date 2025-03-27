'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';

const ForgotPasswordPage = dynamic(
  () => import('@/features/auth/presentation/ForgotPasswordPage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

const ForgotPassword = () => {
  return <ForgotPasswordPage />;
};

export default ForgotPassword;
