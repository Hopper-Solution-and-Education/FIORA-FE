import SelectField from '@/components/common/forms/select/SelectField';
import { useAppDispatch, useAppSelector } from '@/store';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';

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
  name,
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
    if (value && name) {
      setBankAccounts([
        {
          value: value,
          label: value,
        },
      ]);
    }
  }, [value, name]);

  return (
    <SelectField
      name={name}
      value={value}
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
