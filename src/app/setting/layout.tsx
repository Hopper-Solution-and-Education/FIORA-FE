import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import SessionSidebar from '@/components/providers/SessionSidebar';
import { settingNavItems } from '@/features/setting/constants/sidebarData';

export const metadata: Metadata = {
  title: 'FIORA | Settings',
  description: 'Fiora settings',
};

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true' || true;

  return (
    <SessionSidebar appLabel="Settings" defaultOpen={defaultOpen} navItems={settingNavItems}>
      {children}
    </SessionSidebar>
  );
}
