'use client';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import Footer from '@/features/landing/presentation/components/Footer';
import Header from '@/features/landing/presentation/components/Header';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import React from 'react';

interface FaqsLayoutProps {
  children: React.ReactNode;
}

const FaqsLayout = ({ children }: FaqsLayoutProps) => {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.FAQ_FEATURE}>
      <div className="bg-background">
        <Header />
        <div className="flex flex-1 flex-col space-y-8 p-16 mt-12 min-h-[calc(100vh-120px)]">
          <Breadcrumbs />
          {children}
        </div>
        <Footer />
      </div>
    </ModuleAccessLayout>
  );
};

export default FaqsLayout;
