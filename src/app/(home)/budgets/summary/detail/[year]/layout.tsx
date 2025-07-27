import BudgetsDetailLayout from '@/features/home/module/budgets/summary-detail/presentation/pages/BudgetDetailLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Budget Detail',
  description: 'FIORA - Budget Detail',
};

interface BudgetsDetailLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: BudgetsDetailLayoutProps) {
  return <BudgetsDetailLayout>{children}</BudgetsDetailLayout>;
}
