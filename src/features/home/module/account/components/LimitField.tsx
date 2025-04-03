import React from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import InputCurrency from '@/components/common/atoms/InputCurrency';

interface LimitFieldProps {
  name: string;
  value?: number;
  onChange?: (value: number) => void;
  error?: FieldError;
  [key: string]: any;
}

const LimitField: React.FC<LimitFieldProps> = ({
  name,
  value = 0,
  onChange = () => {},
  error,
  ...props
}) => {
  const { watch } = useFormContext();
  const type = watch('type');
  const currencyType = watch('currency');

  if (type !== ACCOUNT_TYPES.CREDIT_CARD) return null;

  return (
    <InputCurrency
      label="Limit"
      name={name}
      value={value}
      currency={currencyType}
      onChange={onChange}
      error={error}
      {...props}
    />
  );
};

export default LimitField;
