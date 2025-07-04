import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | FAQs',
  description: 'FIORA - FAQs',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  return <ModuleAccessLayout featureFlag={FeatureFlags.FAQ_FEATURE}>{children}</ModuleAccessLayout>;
}
