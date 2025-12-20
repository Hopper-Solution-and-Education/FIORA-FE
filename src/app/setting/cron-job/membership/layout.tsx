import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags, USER_ROLES } from '@/shared/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Cronjob Membership',
  description: 'FIORA - Cronjob Membership',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout
      featureFlag={FeatureFlags.MEMBERSHIP_FEATURE}
      requiredRoles={[USER_ROLES.ADMIN]}
    >
      {children}
    </ModuleAccessLayout>
  );
}
