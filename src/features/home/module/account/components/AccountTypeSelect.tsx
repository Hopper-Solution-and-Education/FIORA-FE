import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldError } from 'react-hook-form';
import SelectField, { Option } from '@/components/common/atoms/SelectField';

interface AccountTypeSelectProps {
  name: string;
  value?: string;
  options: Array<Option>;
  onChange?: (value: string) => void;
  error?: FieldError;
  [key: string]: any;
}

const AccountTypeSelect: React.FC<AccountTypeSelectProps> = ({
  name,
  value = '',
  options,
  onChange = () => {},
  error,
  ...props
}) => {
  const { watch } = useFormContext();
  const isTypeDisabled = watch('isTypeDisabled') || false;

  return (
    <SelectField
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select type"
      disabled={isTypeDisabled}
      error={error}
      {...props}
    />
  );
};

export default AccountTypeSelect;
