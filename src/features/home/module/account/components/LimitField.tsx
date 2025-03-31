import React from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { ACCOUNT_TYPES } from '@/shared/constants/account';
import InputField from '@/components/common/atoms/InputField';

interface LimitFieldProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  [key: string]: any;
}

const LimitField: React.FC<LimitFieldProps> = ({
  name,
  value = '',
  onChange = () => {},
  error,
  ...props
}) => {
  const { watch } = useFormContext();
  const type = watch('type');
  if (type !== ACCOUNT_TYPES.CREDIT_CARD) return null;

  return (
    <InputField
      name={name}
      value={value}
      onChange={onChange}
      placeholder="0.00"
      error={error}
      {...props}
    />
  );
};

export default LimitField;
