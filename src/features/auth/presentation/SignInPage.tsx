'use client';

import { LoginForm } from '@/features/auth/presentation/organisms/LoginForm';

const SignInPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="w-full max-w-3xl px-4 sm:px-6 md:w-4/5 lg:w-3/5">
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
