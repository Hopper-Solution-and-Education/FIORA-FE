import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { WalletLayout as WalletWrapper } from '@/features/home/module/wallet/presentation/module/client/pages';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Wallet',
  description: 'FIORA Wallet Dashboard',
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.WALLET_FEATURE}>
      <WalletWrapper>{children}</WalletWrapper>
    </ModuleAccessLayout>
  );
}
