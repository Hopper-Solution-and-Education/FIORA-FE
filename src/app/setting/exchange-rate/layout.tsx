import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Create Account',
  description: 'FIORA - Create Account',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.EXCHANGE_RATE_FEATURE} requiredRoles={['ADMIN']}>
      {children}
    </ModuleAccessLayout>
  );
}
