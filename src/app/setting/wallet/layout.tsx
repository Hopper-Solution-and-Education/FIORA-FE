import ModuleAccessLayout from '@/components/layouts/access-layout/ModuleAccessLayout';
import { WalletSettingLayout } from '@/features/setting/module/wallet/presentation/pages';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FIORA | Deposit FX',
  description: 'FIORA - Deposit FX',
};

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <ModuleAccessLayout featureFlag={FeatureFlags.WALLET_FEATURE} requiredRoles={['ADMIN']}>
      <WalletSettingLayout>{children}</WalletSettingLayout>
    </ModuleAccessLayout>
  );
}
