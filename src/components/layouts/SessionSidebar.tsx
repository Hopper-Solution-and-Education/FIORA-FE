'use client';

import AppSidebar from '@/components/layouts/AppSidebar';
import AuthLayout from '@/components/layouts/auth-layout';
import Header from '@/components/layouts/DashboardHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { navItems as HomeNavItems } from '@/features/home/constants/data';
import { Session, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { MODULE } from '@/shared/constants';
import { setCurrentModule } from '@/shared/utils/storage';

interface SessionSidebarProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function SessionSidebar({ children, defaultOpen = true }: SessionSidebarProps) {
  const { data: session } = useSession() as { data: Session | null };

  useEffect(() => {
    if (session?.user) {
      // Set initial module based on user role
      const currentModule = session.user.role === 'Admin' ? MODULE.ADMIN : MODULE.HOME;
      setCurrentModule(currentModule);
    }
  }, [session?.user?.role]);

  if (!session?.user) {
    return (
      <>
        <main>{children}</main>
      </>
    );
  }

  return (
    <AuthLayout requiresAuth={true}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar appLabel="Overview" navItems={HomeNavItems} />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </AuthLayout>
  );
}
