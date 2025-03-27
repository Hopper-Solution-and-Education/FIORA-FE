'use client';

import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';

const SignInPage = dynamic(() => import('@/features/auth/presentation/SignInPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const SignIn = () => {
  return <SignInPage />;
};

export default SignIn;
