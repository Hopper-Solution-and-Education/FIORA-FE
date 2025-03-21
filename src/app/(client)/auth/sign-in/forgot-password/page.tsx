'use client';
import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

const ForgotPasswordPage = dynamic(
  () => import('@/features/auth/presentation/ForgotPasswordPage'),
  {
    loading: () => <Loading />,
    ssr: false,
  },
);

const ForgotPassword = () => {
  return (
    <section className="bg-muted py-16 px-2">
      <ForgotPasswordPage />
    </section>
  );
};

export default ForgotPassword;
