import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldError } from 'react-hook-form';
import { CategoryType } from '@prisma/client';
import SelectField from '@/components/common/atoms/SelectField';

interface TypeSelectProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  [key: string]: any;
}

const TypeSelect: React.FC<TypeSelectProps> = ({
  name,
  value = '',
  onChange = () => {},
  error,
  ...props
}) => {
  const { watch } = useFormContext();
  const isTypeDisabled = watch('isTypeDisabled') || false;

  const options = [
    { value: CategoryType.Expense, label: 'Expense' },
    { value: CategoryType.Income, label: 'Income' },
  ];

  return (
    <SelectField
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      placeholder="Select category type"
      disabled={isTypeDisabled}
      error={error}
      {...props}
    />
  );
};

export default TypeSelect;
