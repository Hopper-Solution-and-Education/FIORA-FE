import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Budgets Control',
  description: 'FIORA Budgets Control',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.BUDGET_FEATURE}>{children}</ModuleAccessLayout>
  );
}
