import AppSidebar from '@/components/layouts/AppSidebar';
import AuthLayout from '@/components/layouts/auth-layout';
import Header from '@/components/layouts/DashboardHeader';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { navItems as HomeNavItems } from '@/features/home/constants/data';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
  title: 'Fiora Dashboard',
  description: 'Basic Fiora dashboard',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true' || true;
  const session = await getServerSession(authOptions);

  console.log(session);

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
