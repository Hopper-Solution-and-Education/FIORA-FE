'use client';
import Loading from '@/components/common/Loading';
import dynamic from 'next/dynamic';
import React from 'react';
const LandingPageRender = dynamic(() => import('@/features/landing/presentation/LandingPage'), {
  loading: () => <Loading />,
  ssr: false,
});

const page = () => {
  return <LandingPageRender />;
};

export default page;
