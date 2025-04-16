import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldError } from 'react-hook-form';
import { CategoryType } from '@prisma/client';
import SelectField from '@/components/common/forms/select/SelectField';

interface ParentCategorySelectUpdateProps {
  name: string;
  options: { value: string; label: string; type: CategoryType }[];
  disabled?: boolean;
  value?: string | null;
  onChange?: (value: string | null) => void;
  error?: FieldError;
  [key: string]: any;
}

const ParentCategorySelectUpdate: React.FC<ParentCategorySelectUpdateProps> = ({
  name,
  options,
  disabled,
  value = null,
  onChange = () => {},
  error,
  ...props
}) => {
  const { setValue } = useFormContext();

  const handleChange = (selectedValue: string) => {
    const newValue = selectedValue === 'null' ? null : selectedValue;
    onChange(newValue);
    if (newValue) {
      const selectedOption = options.find((option) => option.value === newValue);
      if (selectedOption) {
        setValue('type', selectedOption.type);
        setValue('isTypeDisabled', true);
      }
    } else {
      setValue('isTypeDisabled', false);
    }
  };

  const selectOptions = disabled
    ? [{ value: 'null', label: 'Subcategories exist. Parent locked' }]
    : [
        { value: 'null', label: 'None' },
        ...options.map((option) => ({ value: option.value, label: option.label })),
      ];

  return (
    <SelectField
      name={name}
      value={value ?? 'null'}
      onChange={handleChange}
      options={selectOptions}
      placeholder="Select parent category"
      disabled={disabled}
      error={error}
      {...props}
    />
  );
};

export default ParentCategorySelectUpdate;
