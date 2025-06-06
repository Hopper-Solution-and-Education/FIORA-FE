'use client';

import Header from '@/components/layouts/dashboard-header/DashboardHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { navItems as HomeNavItems } from '@/features/home/constants/data';
import { NavItem } from '@/features/home/types/Nav.types';
import { Session } from 'next-auth/core/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import AppSidebar from '../layouts/app-side-bar/AppSidebar';

const SIDEBAR_STATE_KEY = 'sidebar-open-state';

interface SessionSidebarProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  navItems?: NavItem[];
  appLabel?: string;
}

const SessionSidebar = ({
  children,
  defaultOpen = true,
  navItems = HomeNavItems,
  appLabel = 'Overview',
}: SessionSidebarProps) => {
  const { data: session } = useSession() as { data: Session | null };
  const [open, setOpen] = useState(() => {
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
      return savedState !== null ? JSON.parse(savedState) : defaultOpen;
    }
    return defaultOpen;
  });

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, JSON.stringify(open));
  }, [open]);

  if (!session?.user) {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }

  return (
    <SidebarProvider defaultOpen={open} open={open} onOpenChange={setOpen}>
      <AppSidebar appLabel={appLabel} navItems={navItems} />
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SessionSidebar;
