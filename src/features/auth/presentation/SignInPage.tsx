'use client';

import { LoginForm } from '@/features/auth/presentation/organisms/LoginForm';

const SignInPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="w-full max-w-4xl px-4 sm:px-6">
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
