'use client';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Loading } from '@/components/common/atoms';
import { SessionSidebar } from '@/components/providers';

import Footer from '@/features/landing/presentation/organisms/Footer';

import Header from '@/features/landing/presentation/organisms/Header';
import { Session, useSession } from 'next-auth/react';
import React from 'react';

interface FaqsLayoutProps {
  children: React.ReactNode;
}

const FaqsLayout = ({ children }: FaqsLayoutProps) => {
  const { data: session, status } = useSession() as { data: Session | null; status: string };

  // const isFeatureEnabled = useFeatureIsOn(FeatureFlags.FAQ_FEATURE as any);

  if (status === 'loading') {
    return <Loading />;
  }

  // if (!isFeatureEnabled) {
  //   notFound();
  // }

  const layoutGuest = () => {
    return (
      <div className="bg-background">
        <Header />
        <div className="flex flex-1 flex-col space-y-8 p-16 mt-12 min-h-[calc(100vh-120px)]">
          <Breadcrumbs />
          {children}
        </div>
        <Footer />
      </div>
    );
  };

  const sessionLayout = () => {
    return <SessionSidebar>{children}</SessionSidebar>;
  };

  return session ? sessionLayout() : layoutGuest();
};

export default FaqsLayout;
