import { Loading } from '@/components/common/atoms';
import SelectField from '@/components/common/forms/select/SelectField';
import { fetchAccounts } from '@/features/home/module/account/slices/actions';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { BANK_ACCOUNTS_TYPE } from '../../utils/constants';

interface BankAccountSelectProps {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  [key: string]: any;
}

type BankAccountOptionType = {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
};

const BankAccountSelect: React.FC<BankAccountSelectProps> = ({
  value,
  onChange = () => {},
  error,
  ...props
}) => {
  const dispatch = useAppDispatch();
  const { data: userData } = useSession();
  const userId = userData?.user?.id;
  const { accounts, filterCriteria } = useAppSelector((state) => state.account);
  const [bankAccounts, setBankAccounts] = useState<BankAccountOptionType[]>([]);

  useEffect(() => {
    if (userId) {
      const updatedFilter = {
        filters: filterCriteria.filters,
        search: '',
        userId,
      };

      // Fetch accounts with updated filter
      dispatch(fetchAccounts(updatedFilter));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (accounts && accounts.data) {
      const filtered: BankAccountOptionType[] = accounts.data
        .filter(
          (acc) => BANK_ACCOUNTS_TYPE.includes(acc.type) && BANK_ACCOUNTS_TYPE.includes(acc.name),
        )
        .map((acc) => ({
          value: acc.id,
          label: acc.name || acc.type,
          icon: acc.icon,
        }));
      setBankAccounts([...filtered]);
    }
  }, [accounts]);

  useEffect(() => {
    if (bankAccounts && bankAccounts.length > 0) {
      onChange(bankAccounts[0]?.value);
    }
  }, [bankAccounts]);

  const matchedValue = bankAccounts.find((acc) => acc.value === value)?.value;
  const matchedName = bankAccounts.find((acc) => acc.label === value)?.label;

  if (accounts.isLoading) {
    <Loading />;
  }

  return (
    <SelectField
      name={value ? matchedName : bankAccounts[0]?.label}
      value={value ? matchedValue : bankAccounts[0]?.value}
      onChange={onChange}
      options={bankAccounts}
      placeholder="Please select a bank account!"
      error={error}
      noneValue={false}
      {...props}
    />
  );
};

export default BankAccountSelect;
