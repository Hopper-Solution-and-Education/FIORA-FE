'use client';

import Header from '@/components/layouts/dashboard-header/DashboardHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { navItems as HomeNavItems } from '@/features/home/constants/data';
import { Session } from 'next-auth/core/types';
import { useSession } from 'next-auth/react';
import AppSidebar from '../layouts/app-side-bar/AppSidebar';

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
