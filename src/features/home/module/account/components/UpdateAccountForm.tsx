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
  validateUpdateAccountSchema,
} from '@/features/home/module/account/slices/types/formSchema';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import { useAppSelector } from '@/store';
import AccountBalanceField from '@/features/home/module/account/components/AccountBalance';

interface UpdateAccountFormProps {
  initialData?: Account;
}

export default function UpdateAccountForm({ initialData }: UpdateAccountFormProps) {
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
  ];

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
    <AccountBalanceField key="balance" name="balance" label="Currency" required />,
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
        schema={validateUpdateAccountSchema}
      />
    </>
  );
}
