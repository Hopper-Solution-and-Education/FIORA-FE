import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Membership Settings',
  description: 'FIORA - Membership Settings',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.MEMBERSHIP_FEATURE} requiredRoles={['ADMIN']}>
      {children}
    </ModuleAccessLayout>
  );
}
