import SelectField from '@/components/common/forms/select/SelectField';
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
  const [bankAccounts, setBankAccounts] = useState<BankAccountOptionType[]>([]);

  useEffect(() => {
    if (value) {
      onChange(value);
    }
  }, [value]);

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
