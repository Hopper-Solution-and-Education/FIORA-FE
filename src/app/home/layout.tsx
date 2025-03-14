import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AppSidebar from '@/components/layouts/AppSidebar';
import Header from '@/components/layouts/DashboardHeader';
import SessionGuard from '@/components/layouts/SessionGuard';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'Fiora Dashboard',
  description: 'Basic Fiora dashboard with Next.js and Shadcn',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';

  return (
    <SessionGuard>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
    </SessionGuard>
  );
}
