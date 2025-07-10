import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import SessionSidebar from '@/components/providers/SessionSidebar';
import { settingNavItems } from '@/features/setting/constants/sidebarData';
import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { USER_ROLES } from '@/shared/constants/featuresFlags';

export const metadata: Metadata = {
  title: 'FIORA | Settings',
  description: 'Fiora settings',
};

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true' || true;

  return (
    <ModuleAccessLayout requiredRoles={[USER_ROLES.ADMIN]}>
      <SessionSidebar appLabel="Settings" defaultOpen={defaultOpen} navItems={settingNavItems}>
        {children}
      </SessionSidebar>
    </ModuleAccessLayout>
  );
}
