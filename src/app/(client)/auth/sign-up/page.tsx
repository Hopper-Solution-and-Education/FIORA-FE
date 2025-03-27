'use client';
import Loading from '@/components/common/atoms/Loading';
import dynamic from 'next/dynamic';
import React from 'react';

const SignUpPage = dynamic(() => import('@/features/auth/presentation/SignUpPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const SignUp = () => {
  return (
    <section className="bg-muted py-16 px-2">
      <SignUpPage />
    </section>
  );
};

export default SignUp;
