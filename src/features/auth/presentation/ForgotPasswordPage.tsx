'use client';
import ForgotPasswordForm from '@/features/auth/presentation/organisms/ForgotPasswordForm';
import React from 'react';

const ForgotPasswordPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4">
      <div className="w-full max-w-4xl p-2 flex-col gap-6">
        <ForgotPasswordForm />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
