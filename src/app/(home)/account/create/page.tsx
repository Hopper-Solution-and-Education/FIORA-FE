'use client';

import Loading from '@/components/common/atoms/Loading';
import FormPage from '@/components/common/organisms/FormPage';
import CreateAccountForm from '@/features/home/module/account/components/CreateAccountForm';
import { fetchParents } from '@/features/home/module/account/slices/actions';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';

export default function CreateAccount() {
  const dispatch = useAppDispatch();
  const { parentAccounts } = useAppSelector((state) => state.account);

  useEffect(() => {
    if (!parentAccounts.data && !parentAccounts.isLoading) {
      dispatch(fetchParents());
    }
  }, [parentAccounts.data, parentAccounts.isLoading, dispatch]);

  if (parentAccounts.isLoading) {
    return <Loading />;
  }

  return <FormPage title="Create New Account" FormComponent={CreateAccountForm} />;
}
