import React from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import InputField from '@/components/common/atoms/InputField';
import AvailableLimitDisplay from '@/features/home/module/account/components/AvailableLimitDisplay';

interface AccountBalanceFieldProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  [key: string]: any;
}

const AccountBalanceField: React.FC<AccountBalanceFieldProps> = ({
  name,
  value = '',
  onChange = () => {},
  error,
  ...props
}) => {
  const { watch } = useFormContext();
  const type = watch('type');

  return (
    <>
      <InputField
        label={type === ACCOUNT_TYPES.CREDIT_CARD ? 'Current Balance' : 'Balance'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder="0.00"
        error={error}
        {...props}
      />
      <AvailableLimitDisplay />
    </>
  );
};

export default AccountBalanceField;
