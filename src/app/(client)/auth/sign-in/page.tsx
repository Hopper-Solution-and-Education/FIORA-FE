'use client';
import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';
import AuthUILayout from '../layout';

const SignInPage = dynamic(() => import('@/features/auth/presentation/SignInPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const SignIn = () => {
  return (
    <AuthUILayout>
      <SignInPage />
    </AuthUILayout>
  );
};

export default SignIn;
