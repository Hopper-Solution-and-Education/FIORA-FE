import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags, USER_ROLES } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Membership Settings',
  description: 'FIORA - Membership Settings',
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
