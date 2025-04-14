'use client';

import AppSidebar from '@/components/layouts/AppSidebar';
import Header from '@/components/layouts/DashboardHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { navItems as HomeNavItems } from '@/features/home/constants/data';
import { Session } from 'next-auth/core/types';
import { useSession } from 'next-auth/react';

interface SessionSidebarProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SessionSidebar = ({ children, defaultOpen = true }: SessionSidebarProps) => {
  const { data: session } = useSession() as { data: Session | null };

  if (!session?.user) {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar appLabel="Overview" navItems={HomeNavItems} />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SessionSidebar;
