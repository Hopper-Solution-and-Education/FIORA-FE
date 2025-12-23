import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags, USER_ROLES } from '@/shared/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Create Account',
  description: 'FIORA - Create Account',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout
      featureFlag={FeatureFlags.EXCHANGE_RATE_FEATURE}
      requiredRoles={[USER_ROLES.ADMIN]}
    >
      {children}
    </ModuleAccessLayout>
  );
}
