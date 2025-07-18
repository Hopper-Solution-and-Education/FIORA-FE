'use client';

import { Loading } from '@/components/common/atoms';
import { SessionSidebar } from '@/components/providers';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Header from '@/features/landing/presentation/components/Header';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { useBreadcrumbs } from '@/shared/hooks/useBreadcrumbs';
import { useFeatureIsOn } from '@growthbook/growthbook-react';
import { Slash } from 'lucide-react';
import { Session, useSession } from 'next-auth/react';
import { notFound } from 'next/navigation';
import React, { Fragment } from 'react';

interface FaqsLayoutProps {
  children: React.ReactNode;
}

const FaqsLayout = ({ children }: FaqsLayoutProps) => {
  const { data: session, status } = useSession() as { data: Session | null; status: string };

  const items = useBreadcrumbs();

  const isFeatureEnabled = useFeatureIsOn(FeatureFlags.FAQ_FEATURE as any);

  if (status === 'loading') {
    return <Loading />;
  }

  if (isFeatureEnabled) {
    notFound();
  }

  const guestBreadcrumbs = () => {
    if (items && items.length === 0) return null;

    if (items[0].title === 'Home') {
      items[0].title = 'Landing';
    }

    return (
      <Breadcrumb>
        <BreadcrumbList>
          {items &&
            items.map((item, index) => (
              <Fragment key={item.title}>
                {index !== items.length - 1 && (
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href={item.link}>{item.title}</BreadcrumbLink>
                  </BreadcrumbItem>
                )}
                {index < items.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block">
                    <Slash />
                  </BreadcrumbSeparator>
                )}
                {index === items.length - 1 && <BreadcrumbPage>{item.title}</BreadcrumbPage>}
              </Fragment>
            ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  };

  const layoutGuest = () => {
    return (
      <div className="bg-background">
        <Header />
        <div className="flex flex-1 flex-col space-y-8 p-16 mt-12 min-h-[calc(100vh-120px)]">
          {guestBreadcrumbs()}
          {children}
        </div>
      </div>
    );
  };

  const sessionLayout = () => {
    return <SessionSidebar>{children}</SessionSidebar>;
  };

  return session ? sessionLayout() : layoutGuest();
};

export default FaqsLayout;
