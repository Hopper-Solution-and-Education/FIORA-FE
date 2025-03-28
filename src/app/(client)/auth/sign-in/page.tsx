'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

const SignInPage = dynamic(() => import('@/features/auth/presentation/SignInPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const SignIn = () => {
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    const isSignUpSuccess = query.get('registerSuccess') === 'true';
    const registerSuccessMsg = localStorage.getItem('signupMsg');
    if (isSignUpSuccess && registerSuccessMsg) {
      toast.success(
        registerSuccessMsg ||
          'You have successfully registered. Please check your email to verify your account.',
      );
      localStorage.removeItem('signupMsg');
    }

    const resetSuccessFromQuery = query.get('reset') === 'success';
    const resetSuccessFromLocalStorage = localStorage.getItem('resetPasswordSuccess') === 'true';
    if (resetSuccessFromQuery && resetSuccessFromLocalStorage) {
      toast.success('Congratulation! You have reset your password successfully');
      localStorage.removeItem('resetPasswordSuccess');
    }

    query.delete('registerSuccess');
    query.delete('reset');
    const newSearch = query.toString();
    const newUrl = newSearch ? `/auth/sign-in?${newSearch}` : '/auth/sign-in';
    router.replace(newUrl);
  }, [router]);

  return <SignInPage />;
};

export default SignIn;
