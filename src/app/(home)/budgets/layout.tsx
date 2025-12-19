import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import BudgetUpdater from '@/features/home/module/budgets/summary-detail/presentation/pages/BudgetUpdater';
import { FeatureFlags } from '@/shared/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Budgets Control',
  description: 'FIORA Budgets Control',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.BUDGET_FEATURE}>
      <BudgetUpdater />

      {children}
    </ModuleAccessLayout>
  );
}
