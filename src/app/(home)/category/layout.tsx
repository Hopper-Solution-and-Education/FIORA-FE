import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Categories',
  description: 'FIORA - Categories',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.CATEGORY_FEATURE}>{children}</ModuleAccessLayout>
  );
}
