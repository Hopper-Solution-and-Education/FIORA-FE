'use client';

import { MainContent } from '@/components/layouts';
import Footer from '@/features/landing/presentation/organisms/Footer';
import Header from '@/features/landing/presentation/organisms/Header';
import React from 'react';

interface AuthUILayoutProps {
  children: React.ReactNode;
}

const AuthUILayout = ({ children }: AuthUILayoutProps) => {
  return (
    <>
      <Header />

      <MainContent>
        {children}

        <Footer />
      </MainContent>
    </>
  );
};

export default AuthUILayout;
