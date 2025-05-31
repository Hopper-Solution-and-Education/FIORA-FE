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
  const { setValue, getValues } = useFormContext();
  const currentParentId = getValues('parentId');
  const currentParentName = getValues('parentName');

  const handleChange = (selectedValue: string) => {
    const newValue = selectedValue === 'null' ? null : selectedValue;
    onChange(newValue);
    if (newValue) {
      const selectedOption = options.find((option) => option.value === newValue);
      if (selectedOption) {
        setValue('type', selectedOption.type);
        setValue('isTypeDisabled', true);
        setValue('parentName', selectedOption.label);
        setValue('parentType', selectedOption.type);
      }
    } else {
      setValue('isTypeDisabled', false);
      setValue('parentName', '');
      setValue('parentType', '');
    }
  };

  const selectOptions = disabled
    ? [{ value: currentParentId, label: currentParentName || 'Parent locked' }]
    : [...options.map((option) => ({ value: option.value, label: option.label }))];

  return (
    <SelectField
      name={name}
      value={value || currentParentId || 'null'}
      onChange={handleChange}
      options={selectOptions}
      placeholder="Select parent"
      disabled={disabled}
      error={error}
      {...props}
    />
  );
};

export default ParentCategorySelectUpdate;
