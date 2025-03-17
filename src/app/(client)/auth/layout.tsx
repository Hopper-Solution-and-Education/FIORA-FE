'use client';

import Footer from '@/features/landing/presentation/components/Footer';
import Header from '@/features/landing/presentation/components/Header';
import React from 'react';

interface AuthUILayoutProps {
  children: React.ReactNode;
}

const AuthUILayout = ({ children }: AuthUILayoutProps) => {
  return (
    <div className="bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default AuthUILayout;
