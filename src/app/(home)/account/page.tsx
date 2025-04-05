'use client';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import Loading from '@/components/common/atoms/Loading';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { MODULE } from '@/shared/constants';
import { getCurrentModule, setCurrentModule } from '@/shared/utils/storage';

const AccountDashboardRender = dynamic(
  () => import('@/features/home/module/account/AccountDashboard'),
  {
    loading: () => <Loading />,
  },
);

const AccountPage = () => {
  const currentModule = getCurrentModule();
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(
    FeatureFlags.ACCOUNT_FEATURE,
    currentModule,
  );

  useEffect(() => {
    if (!currentModule || currentModule === MODULE.HOME) {
      setCurrentModule(MODULE.ACCOUNT);
    }
  }, [currentModule]);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  return <AccountDashboardRender module={currentModule} />;
};

export default AccountPage;
