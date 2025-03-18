'use client';
import SignUpForm from '@/features/auth/presentation/organisms/SignUpForm';
import React from 'react';

const SignUpPage = () => {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-4 bg-white">
      <div className="w-full sm:w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 max-w-lg md:max-w-xl lg:max-w-2xl flex-col gap-6">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
