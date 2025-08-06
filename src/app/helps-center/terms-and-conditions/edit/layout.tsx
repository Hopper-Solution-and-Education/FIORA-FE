import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { USER_ROLES } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Terms and Conditions Edit',
  description: 'FIORA - Terms and Conditions Edit',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.CS]}>
      {children}
    </ModuleAccessLayout>
  );
}
