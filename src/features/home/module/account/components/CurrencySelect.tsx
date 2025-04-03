import React from 'react';
import { FieldError } from 'react-hook-form';
import SelectField from '@/components/common/atoms/SelectField';

interface CurrencySelectProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  [key: string]: any;
}

const CurrencySelect: React.FC<CurrencySelectProps> = ({
  name,
  value = '',
  onChange = () => {},
  error,
  ...props
}) => {
  const options = [
    { value: 'VND', label: '(đ) VND' },
    { value: 'USD', label: '($) USD' },
  ];

  return (
    <SelectField
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select currency"
      error={error}
      {...props}
    />
  );
};

export default CurrencySelect;
