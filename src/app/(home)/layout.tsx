import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import SessionSidebar from '@/components/providers/SessionSidebar';

export const metadata: Metadata = {
  title: 'Fiora Dashboard',
  description: 'Basic Fiora dashboard',
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true' || true;

  return <SessionSidebar defaultOpen={defaultOpen}>{children}</SessionSidebar>;
}
