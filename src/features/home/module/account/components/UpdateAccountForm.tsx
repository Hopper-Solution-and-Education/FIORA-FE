'use client';

import React from 'react';
import GlobalIconSelect from '@/components/common/atoms/GlobalIconSelect';
import InputField from '@/components/common/atoms/InputField';
import GlobalForm from '@/components/common/organisms/GlobalForm';
import AccountTypeSelect from '@/features/home/module/account/components/AccountTypeSelect';
import CurrencySelect from '@/features/home/module/account/components/CurrencySelect';
import LimitField from '@/features/home/module/account/components/LimitField';
import ParentAccountSelect from '@/features/home/module/account/components/ParentAccountSelect';
import { Account } from '@/features/home/module/account/slices/types';
import {
  defaultNewAccountValues,
  validateUpdateAccountSchema,
} from '@/features/home/module/account/slices/types/formSchema';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import { useAppDispatch, useAppSelector } from '@/store';
import AccountBalanceField from '@/features/home/module/account/components/AccountBalance';
import AvailableLimitDisplay from '@/features/home/module/account/components/AvailableLimitDisplay';
import { updateAccount } from '@/features/home/module/account/slices/actions';
import { Response } from '@/shared/types/Common.types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import DeleteAccountDialog from '@/features/home/module/account/components/DeleteAccountDialog';

interface UpdateAccountFormProps {
  initialData?: Account;
}

export default function UpdateAccountForm({ initialData }: UpdateAccountFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { parentAccounts } = useAppSelector((state) => state.account);

  const parentOptions =
    (parentAccounts.data &&
      parentAccounts.data.length > 0 &&
      parentAccounts.data.map((account) => ({
        value: account.id,
        label: account.name,
        type: account.type,
        icon: account.icon,
      }))) ||
    [];

  const accountTypeOptions = [
    { value: ACCOUNT_TYPES.PAYMENT, label: ACCOUNT_TYPES.PAYMENT },
    { value: ACCOUNT_TYPES.SAVING, label: ACCOUNT_TYPES.SAVING },
    { value: ACCOUNT_TYPES.CREDIT_CARD, label: ACCOUNT_TYPES.CREDIT_CARD },
    { value: ACCOUNT_TYPES.DEBT, label: ACCOUNT_TYPES.DEBT },
    { value: ACCOUNT_TYPES.LENDING, label: ACCOUNT_TYPES.LENDING },
    { value: ACCOUNT_TYPES.INVEST, label: ACCOUNT_TYPES.INVEST },
  ];

  const generateBalanceInitialValue = () => {
    if (initialData) {
      return initialData.type === ACCOUNT_TYPES.CREDIT_CARD
        ? -initialData.balance
        : Number(initialData.balance);
    }
    return 0;
  };

  const generateIsTypeDisabledInitialValue = () => {
    if (!initialData) return false;

    if (initialData.parentId) return true;

    if (initialData.children && initialData.children.length > 0) return true;

    return false;
  };

  const generateAvailableLimitInitialValue = () => {
    if (!initialData || (initialData && initialData.type !== ACCOUNT_TYPES.CREDIT_CARD)) return 0;
    return Number(initialData.limit) || 0;
  };

  const generateLimitedInitialValue = () => {
    return initialData && initialData.type === ACCOUNT_TYPES.CREDIT_CARD
      ? Number(initialData.limit) || 0
      : 0;
  };

  const fields = [
    <GlobalIconSelect key="icon" name="icon" label="Icon" required />,
    <InputField key="name" name="name" placeholder="Account Name" label="Name" required />,
    <ParentAccountSelect
      key="parentId"
      name="parentId"
      options={parentOptions}
      disabled={true}
      label="Parent"
    />,
    <AccountTypeSelect
      key="type"
      name="type"
      label="Type"
      options={accountTypeOptions}
      disabled={true}
      required
    />,
    <CurrencySelect key="currency" name="currency" label="Currency" required />,
    <LimitField key="limit" name="limit" label="Limit" />,
    <AccountBalanceField key="balance" name="balance" label="Balance" required />,
    <AvailableLimitDisplay key="availableLimit" name="availableLimit" />,
  ];

  const defaultValues = {
    ...defaultNewAccountValues,
    ...initialData,
    balance: generateBalanceInitialValue(),
    limit: generateLimitedInitialValue(),
    isTypeDisabled: generateIsTypeDisabledInitialValue(),
    availableLimit: generateAvailableLimitInitialValue(),
  };

  const onSubmit = async (data: any) => {
    try {
      if (!initialData) return;
      const finalData: Account = {
        ...data,
        balance: data.balance || 0,
        limit: data.limit ? Number(data.limit) : undefined,
        parentId: data.parentId || undefined,
        availableLimit: undefined,
      };

      await dispatch(updateAccount({ id: initialData.id, data: finalData }))
        .unwrap()
        .then((value: Response<Account>) => {
          if (value.status == 200) {
            router.push('/home/account');
            toast.success('You have edit the Account successfully!');
          }
        });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <>
      <GlobalForm
        fields={fields}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={validateUpdateAccountSchema}
      />
      <DeleteAccountDialog />
    </>
  );
}
