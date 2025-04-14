'use client';

import AppSidebar from '@/components/layouts/AppSidebar';
import AuthLayout from '@/components/layouts/auth-layout';
import Header from '@/components/layouts/DashboardHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { navItems as HomeNavItems } from '@/features/home/constants/data';
import { Session, useSession } from 'next-auth/react';
interface SessionSidebarProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function SessionSidebar({ children, defaultOpen = true }: SessionSidebarProps) {
  const { data: session } = useSession() as { data: Session | null };

  if (!session?.user) {
    return (
      <AuthLayout requiresAuth={true}>
        <main>{children}</main>
      </AuthLayout>
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
