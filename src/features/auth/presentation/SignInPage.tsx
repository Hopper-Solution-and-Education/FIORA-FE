'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LoginForm } from '@/features/auth/presentation/organisms/LoginForm';

const SignInPage = () => {
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const resetSuccessFromQuery = query.get('reset') === 'success';
    const resetSuccessFromLocalStorage = localStorage.getItem('resetPasswordSuccess') === 'true';

    if (resetSuccessFromQuery && resetSuccessFromLocalStorage) {
      toast.success('Congratulation! You have reset your password successfully');
      localStorage.removeItem('resetPasswordSuccess');

      query.delete('reset');
      const newSearch = query.toString();
      const newUrl = newSearch ? `/auth/sign-in?${newSearch}` : '/auth/sign-in';
      router.replace(newUrl);
    }
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="w-full max-w-3xl px-4 sm:px-6 md:w-4/5 lg:w-3/5">
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
