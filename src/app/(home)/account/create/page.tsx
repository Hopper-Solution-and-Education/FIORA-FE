'use client';

import Loading from '@/components/common/atoms/Loading';
import FormPage from '@/components/common/organisms/FormPage';
import CreateAccountForm from '@/features/home/module/account/components/CreateAccountForm';
import { fetchParents } from '@/features/home/module/account/slices/actions';
import { useFeatureFlagGuard } from '@/hooks/useFeatureFlagGuard';
import { FeatureFlags } from '@/shared/constants/featuresFlags';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';

export default function CreateAccount() {
  const dispatch = useAppDispatch();
  const { parentAccounts } = useAppSelector((state) => state.account);
  const { isLoaded } = useFeatureFlagGuard(FeatureFlags.ACCOUNT_FEATURE);

  useEffect(() => {
    if (!parentAccounts.data && !parentAccounts.isLoading) {
      dispatch(fetchParents());
    }
  }, [parentAccounts.data, parentAccounts.isLoading, dispatch]);

  if (!isLoaded) {
    return <Loading />;
  }

  return <FormPage title="Create New Account" FormComponent={CreateAccountForm} />;
}
