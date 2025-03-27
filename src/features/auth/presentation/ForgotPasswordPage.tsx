'use client';
import ForgotPasswordForm from '@/features/auth/presentation/organisms/ForgotPasswordForm';
import React from 'react';

const ForgotPasswordPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <div className="w-full sm:w-3/4 md:w-2/3 lg:w-3/5 xl:w-3/4 2xl:w-2/3 max-w-4xl flex-col gap-6">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
