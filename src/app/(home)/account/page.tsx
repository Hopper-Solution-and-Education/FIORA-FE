'use client';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import Loading from '@/components/common/atoms/Loading';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import dynamic from 'next/dynamic';
import { MODULE } from '@/shared/constants';

export type AccountModule = 'HOME' | 'ACCOUNT';

interface AccountPageProps {
  module?: AccountModule;
}

const AccountDashboardRender = dynamic(
  () => import('@/features/home/module/account/AccountDashboard'),
  {
    loading: () => <Loading />,
  },
);

const AccountPage = ({ module = MODULE.ACCOUNT }: AccountPageProps) => {
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(FeatureFlags.ACCOUNT_FEATURE, module);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <AccountDashboardRender module={module} />;
};

export default AccountPage;
