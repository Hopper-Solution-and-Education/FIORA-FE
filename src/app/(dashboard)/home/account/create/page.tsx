'use client';

import Loading from '@/components/common/atoms/Loading';
// import FormPage from '@/components/common/organisms/FormPage';
// import CreateAccountForm from '@/features/home/module/account/components/CreateAccountForm';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import { FeatureFlags } from '@/shared/constants/featuresFlags';

export default function CreateAccount() {
  const { isLoaded, isFeatureOn } = useFeatureFlagGuard(FeatureFlags.ACCOUNT_FEATURE);

  if (!isLoaded) {
    return <Loading />;
  }

  if (!isFeatureOn) {
    return null;
  }

  //   return <FormPage title="Create New Account" FormComponent={CreateAccountForm} />;
  return null;
}
