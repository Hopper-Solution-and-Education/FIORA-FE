'use client';

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
  validateNewAccountSchema,
} from '@/features/home/module/account/slices/types/formSchema';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import { useAppSelector } from '@/store';
import DeleteAccountDialog from './DeleteAccountDialog';

interface UpdateAccountFormProps {
  initialData?: Account;
}

export default function UpdateAccountForm({ initialData }: UpdateAccountFormProps) {
  const { parentAccounts } = useAppSelector((state) => state.account);

  const parentOptions =
    parentAccounts.data
      ?.filter((acc) => acc.id !== initialData?.id && !acc.parentId)
      .map((account) => ({
        value: account.id,
        label: account.name,
        type: account.type,
      })) || [];

  const isParentDisabled = initialData && initialData.parentId ? true : false;

  const generateBalanceInitialValue = () => {
    if (initialData) {
      return initialData.type === ACCOUNT_TYPES.CREDIT_CARD
        ? -initialData.balance
        : initialData.balance;
    }
    return 0;
  };

  const generateIsTypeDisabledInitialValue = () => {
    if (!initialData) return false;

    if (initialData.parentId) return true;

    if (initialData.children && initialData.children.length > 0) return true;

    return false;
  };

  const fields = [
    <InputField key="name" name="name" placeholder="Account Name" />,
    <GlobalIconSelect key="icon" name="icon" />,
    <ParentAccountSelect
      key="parentId"
      name="parentId"
      options={parentOptions}
      disabled={isParentDisabled}
    />,
    <AccountTypeSelect key="type" name="type" />,
    <CurrencySelect key="currency" name="currency" />,
    <LimitField key="limit" name="limit" />,
    <InputField
      key="balance"
      name="balance"
      placeholder={initialData?.type === ACCOUNT_TYPES.CREDIT_CARD ? 'Current Balance' : 'Balance'}
    />,
  ];

  const defaultValues = {
    ...defaultNewAccountValues,
    ...initialData,
    balance: generateBalanceInitialValue(),
    isTypeDisabled: generateIsTypeDisabledInitialValue(),
  };

  const onSubmit = async (data: any) => {
    console.log('Form data:', data);
    // try {
    //   const finalData = {
    //     ...data,
    //     balance:
    //       data.type === ACCOUNT_TYPES.CREDIT_CARD
    //         ? -Number(data.balance)
    //         : Number(data.balance) || 0,
    //     limit: data.limit ? Number(data.limit) : undefined,
    //     parentId: data.parentId || undefined,
    //   };
    //   await dispatch(updateAccount({ id: initialData.id, data: finalData })).unwrap();
    //   toast.success('Account updated successfully');
    //   router.push('/home/account');
    // } catch (error) {
    //   console.error('Error updating account:', error);
    //   toast.error('Failed to update account');
    // }
  };

  return (
    <>
      <GlobalForm
        fields={fields}
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        schema={validateNewAccountSchema}
      />
      <DeleteAccountDialog />
    </>
  );
}
