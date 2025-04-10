'use client';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import Loading from '@/components/common/atoms/Loading';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import dynamic from 'next/dynamic';
import { MODULE } from '@/shared/constants';

const AccountDashboardRender = dynamic(
  () => import('@/features/home/module/account/AccountDashboard'),
  {
    loading: () => <Loading />,
  },
);

const AccountPage = () => {
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(
    FeatureFlags.ACCOUNT_FEATURE,
    MODULE.ACCOUNT,
  );

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <AccountDashboardRender module={MODULE.ACCOUNT} />;
};

export default AccountPage;
