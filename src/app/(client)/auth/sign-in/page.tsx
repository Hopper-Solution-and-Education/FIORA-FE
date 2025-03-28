'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const SignInPage = dynamic(() => import('@/features/auth/presentation/SignInPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const SignIn = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  let isSignUpSuccess = searchParams?.get('registerSuccess');
  const registerSuccessMsg = localStorage.getItem('signupMsg');

  useEffect(() => {
    if (isSignUpSuccess !== undefined) {
      if (isSignUpSuccess === 'true' && registerSuccessMsg) {
        toast.success(
          registerSuccessMsg ||
            'You have successfully registered. Please check your email to verify your account.',
        );
        localStorage.removeItem('signupMsg');
        isSignUpSuccess = 'false';
      }
    }
    router.replace('/auth/sign-in');
  }, []);

  return <SignInPage />;
};

export default SignIn;
