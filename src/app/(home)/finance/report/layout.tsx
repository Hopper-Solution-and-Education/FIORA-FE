import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Finance Report',
  description: 'FIORA - Finance Chart Report',
};

export default async function FinanceChartLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.FINANCE_FEATURE}>{children}</ModuleAccessLayout>
  );
}
