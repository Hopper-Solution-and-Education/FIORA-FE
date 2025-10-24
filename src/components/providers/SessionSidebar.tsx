'use client';

import { AppSidebar, Header, MainContent } from '@/components/layouts';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { expandNavItems, shrinkNavItems } from '@/features/home/constants/data';
import { NavItem } from '@/features/home/types/Nav.types';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { Session } from 'next-auth/core/types';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Breadcrumbs } from '../Breadcrumbs';
import { Separator } from '../ui/separator';

const SIDEBAR_STATE_KEY = 'sidebar-open-state';

interface SessionSidebarProps extends React.PropsWithChildren {
  defaultOpen?: boolean;
  navItems?: NavItem[];
  appLabel?: string;
}

const SessionSidebar = ({
  children,
  defaultOpen = true,
  navItems,
  appLabel = 'Overview',
}: SessionSidebarProps) => {
  const { data: session } = useSession() as { data: Session | null };
  const isMobile = useIsMobile();

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
    return <>{children}</>;
  }

  const currentNavItems = navItems || (open ? expandNavItems : shrinkNavItems);

  return (
    <SidebarProvider
      id="app-sidebar"
      className="app-bar h-full"
      defaultOpen={open}
      open={open}
      onOpenChange={setOpen}
    >
      <AppSidebar appLabel={appLabel} navItems={currentNavItems} />
      <SidebarInset className="h-full">
        <Header />

        <MainContent>
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between gap-2 p-4">
            <div className="flex items-center gap-4 w-full">
              {isMobile && <SidebarTrigger className="hover:bg-accent transition-colors" />}
              <Separator orientation="vertical" className="mr-2 h-5 bg-border/60" />

              <Breadcrumbs />
            </div>
          </div>

          {children}
        </MainContent>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SessionSidebar;
