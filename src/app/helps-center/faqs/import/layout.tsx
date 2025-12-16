import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags, USER_ROLES } from '@/shared/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | FAQs Import',
  description: 'FIORA - FAQs Import',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout
      featureFlag={FeatureFlags.FAQ_FEATURE}
      requiredRoles={[USER_ROLES.ADMIN, USER_ROLES.CS]}
    >
      {children}
    </ModuleAccessLayout>
  );
}
