'use client';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import Loading from '@/components/common/atoms/Loading';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const AccountDashboardRender = dynamic(
  () => import('@/features/home/module/account/AccountDashboard'),
  {
    loading: () => <Loading />,
  },
);

const AccountPage = () => {
  const currentModule = useSelector((state: RootState) => state.module.currentModule);
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(
    FeatureFlags.ACCOUNT_FEATURE,
    currentModule,
  );

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <AccountDashboardRender module={currentModule} />;
};

export default AccountPage;
