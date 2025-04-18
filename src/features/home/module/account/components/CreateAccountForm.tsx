'use client';

import GlobalIconSelect from '@/components/common/forms/select/GlobalIconSelect';
import InputField from '@/components/common/forms/input/InputField';
import GlobalForm from '@/components/common/forms/GlobalForm';
import AccountTypeSelect from '@/features/home/module/account/components/AccountTypeSelect';
import CurrencySelect from '@/features/home/module/account/components/CurrencySelect';
import LimitField from '@/features/home/module/account/components/LimitField';
import ParentAccountSelect from '@/features/home/module/account/components/ParentAccountSelect';
import {
  defaultNewAccountValues,
  validateNewAccountSchema,
} from '@/features/home/module/account/slices/types/formSchema';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import { useAppDispatch, useAppSelector } from '@/store';
import AccountBalanceField from '@/features/home/module/account/components/AccountBalance';
import { createAccount } from '@/features/home/module/account/slices/actions';
import { Response } from '@/shared/types/Common.types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Account } from '@/features/home/module/account/slices/types';
import { Option } from '@/components/common/forms/select/SelectField';
import AvailableLimitDisplay from '@/features/home/module/account/components/AvailableLimitDisplay';

export default function CreateAccountForm() {
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

  const accountTypeOptions: Array<Option> = [
    { value: ACCOUNT_TYPES.PAYMENT, label: ACCOUNT_TYPES.PAYMENT },
    { value: ACCOUNT_TYPES.SAVING, label: ACCOUNT_TYPES.SAVING },
    { value: ACCOUNT_TYPES.CREDIT_CARD, label: ACCOUNT_TYPES.CREDIT_CARD },
    { value: ACCOUNT_TYPES.DEBT, label: ACCOUNT_TYPES.DEBT },
    { value: ACCOUNT_TYPES.LENDING, label: ACCOUNT_TYPES.LENDING },
    { value: ACCOUNT_TYPES.INVEST, label: ACCOUNT_TYPES.INVEST },
  ];

  const memoizedGetAccountTypeOptions = (() => {
    let cache: Array<Option>;
    return () => {
      if (!cache) {
        const parentsArray = Array.from(
          parentAccounts.data ? parentAccounts.data.map((item) => item.type) : [],
        );
        cache = accountTypeOptions.map((item) => {
          const isDisabled = parentsArray.includes(item.value as any);
          return {
            ...item,
            disabled: isDisabled,
          };
        });
      }
      return cache ? cache.sort((a, b) => Number(a.disabled) - Number(b.disabled)) : [];
    };
  })();

  const fields = [
    <GlobalIconSelect key="icon" name="icon" label="Icon" required />,
    <InputField key="name" name="name" placeholder="Account Name" label="Name" required />,
    <ParentAccountSelect
      key="parentId"
      name="parentId"
      options={parentOptions}
      label="Parent Account"
      disabled={false}
    />,
    <AccountTypeSelect
      key="type"
      name="type"
      label="Type"
      options={memoizedGetAccountTypeOptions()}
      required
    />,
    <CurrencySelect key="currency" name="currency" label="Currency" required />,
    <LimitField key="limit" name="limit" label="Limit" />,
    <AccountBalanceField key="balance" name="balance" required />,
    <AvailableLimitDisplay key="availableLimit" name="availableLimit" label="Available Limit" />,
  ];

  const defaultValues = {
    ...defaultNewAccountValues,
    parentName: '',
    parentIcon: '',
    parentType: '',
    parentIsTypeDisabled: false,
  };

  const onSubmit = async (data: any) => {
    try {
      const finalData = {
        ...data,
        balance: data.balance || 0,
        limit: data.limit ? Number(data.limit) : undefined,
        parentId: data.parentId || undefined,
        isTypeDisabled: data.isTypeDisabled,
        availableLimit: data.availableLimit,
      };

      await dispatch(createAccount(finalData))
        .unwrap()
        .then((value: Response<Account>) => {
          if (value.status == 201) {
            router.push('/account');
            toast.success('You have created the Account successfully!');
          }
        });
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <GlobalForm
      fields={fields}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      schema={validateNewAccountSchema}
    />
  );
}
