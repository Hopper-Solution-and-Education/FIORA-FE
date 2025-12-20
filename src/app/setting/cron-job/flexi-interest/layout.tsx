import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags, USER_ROLES } from '@/shared/constants';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'FIORA | Flexi Interest',
  description: 'FIORA - Flexi Interest',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout
      featureFlag={FeatureFlags.WALLET_FEATURE}
      requiredRoles={[USER_ROLES.ADMIN]}
    >
      {children}
    </ModuleAccessLayout>
  );
}
