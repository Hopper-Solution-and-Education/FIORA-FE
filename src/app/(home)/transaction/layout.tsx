import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Transactions',
  description: 'FIORA - Transactions',
};

interface TransactionLayoutProps {
  children: React.ReactNode;
}

export default function TransactionLayout({ children }: TransactionLayoutProps) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.TRANSACTION_FEATURE}>
      <section className="sm:px-6 lg:px-8">{children}</section>
    </ModuleAccessLayout>
  );
}
