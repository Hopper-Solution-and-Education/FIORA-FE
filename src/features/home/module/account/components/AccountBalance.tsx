import InputCurrency from '@/components/common/forms/input/InputCurrency';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import { cn } from '@/shared/utils';
import React from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

interface AccountBalanceFieldProps {
  name: string;
  value?: number;
  onChange?: (value: number) => void;
  error?: FieldError;
  [key: string]: any;
}

const AccountBalanceField: React.FC<AccountBalanceFieldProps> = ({
  name,
  value = 0,
  onChange = () => {},
  error,
  ...props
}) => {
  const { watch, setValue } = useFormContext();
  const currencyType = watch('currency') || 'VND';
  const type = watch('type');

  if (type === ACCOUNT_TYPES.CREDIT_CARD || type === ACCOUNT_TYPES.DEBT) {
    if (value > 0) {
      setValue('balance', -value);
    }
  }

  return (
    <>
      <InputCurrency
        label="Balance"
        name={name}
        value={value}
        currency={currencyType}
        onChange={onChange}
        error={error}
        className={cn(value < 0 && 'text-red-500')}
        allowNegative={true}
        {...props}
      />
    </>
  );
};

export default AccountBalanceField;
