import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Product and Services',
  description: 'FIORA - Product and Services',
};

export default async function DashboardProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.PRODUCT_FEATURE}>{children}</ModuleAccessLayout>
  );
}
