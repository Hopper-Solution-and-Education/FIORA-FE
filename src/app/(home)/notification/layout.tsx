import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags, USER_ROLES } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Notification',
  description: 'FIORA - Notification',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout
      featureFlag={FeatureFlags.WALLET_FEATURE}
      requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.CS, USER_ROLES.USER]}
    >
      {children}
    </ModuleAccessLayout>
  );
}
