'use client';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import Loading from '@/components/common/atoms/Loading';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import dynamic from 'next/dynamic';

const AccountDashboardRender = dynamic(
  () => import('@/features/home/module/account/AccountDashboard'),
  {
    loading: () => <Loading />,
  },
);

const AccountPage = () => {
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(FeatureFlags.ACCOUNT_FEATURE);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <AccountDashboardRender />;
};

export default AccountPage;
