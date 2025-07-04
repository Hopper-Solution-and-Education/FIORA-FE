import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';


import { WalletLayout as WalletWrapper } from '@/features/home/module/wallet/presentation/pages';

import { FeatureFlags } from '@/shared/constants/featuresFlags';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Wallet',
  description: 'FIORA Wallet Dashboard',
};

export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.WALLET_FEATURE}>

      <section className="container mx-auto sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6 sm:space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <div className="flex-1">{children}</div>
        </div>
      </section>

      <WalletWrapper>{children}</WalletWrapper>

    </ModuleAccessLayout>
  );
}
