import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Accounts',
  description: 'FIORA - Accounts',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.ACCOUNT_FEATURE}>
      <section className="p-4 md:px-6">{children}</section>
    </ModuleAccessLayout>
  );
}
