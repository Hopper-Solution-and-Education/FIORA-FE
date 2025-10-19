'use client';

import { Loading } from '@/components/common/atoms';
import { StandaloneLayout } from '@/components/layouts';
import SessionSidebar from '@/components/providers/SessionSidebar';

import { Session, useSession } from 'next-auth/react';
import React from 'react';

interface NewsLayoutProps {
  children: React.ReactNode;
}

const NewsLayout = ({ children }: NewsLayoutProps) => {
  const { data: session, status } = useSession() as { data: Session | null; status: string };

  if (status === 'loading') {
    return <Loading />;
  }

  return session ? (
    <SessionSidebar children={children} />
  ) : (
    <StandaloneLayout children={children} />
  );
};

export default NewsLayout;
