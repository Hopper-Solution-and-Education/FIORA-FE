import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Notification',
  description: 'FIORA - Notification',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.WALLET_FEATURE} requiredRoles={['ADMIN']}>
      {children}
    </ModuleAccessLayout>
  );
}
