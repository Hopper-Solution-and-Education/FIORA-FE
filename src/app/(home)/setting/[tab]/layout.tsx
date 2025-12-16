'use client';

import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants';

interface TabLayoutProps {
  children: React.ReactNode;
}

export default function TabLayout({ children }: TabLayoutProps) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.PARTNER_FEATURE}>{children}</ModuleAccessLayout>
  );
}
