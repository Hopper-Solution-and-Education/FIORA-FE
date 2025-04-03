import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldError } from 'react-hook-form';
import SelectField from '@/components/common/atoms/SelectField';
import { AccountType } from '@prisma/client';

interface ParentAccountSelectProps {
  name: string;
  options: { value: string; label: string; icon?: string; disabled?: boolean; type: AccountType }[];
  disabled?: boolean;
  value?: string | null;
  onChange?: (value: string | null) => void;
  error?: FieldError;
  [key: string]: any;
}

const ParentAccountSelect: React.FC<ParentAccountSelectProps> = ({
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
      setValue('type', '');
      setValue('isTypeDisabled', false);
    }
  };

  const selectOptions = disabled
    ? [{ value: 'null', label: 'Parent locked' }]
    : [
        { value: 'null', label: 'None' },
        ...options.map((option) => ({
          value: option.value,
          label: option.label,
          icon: option?.icon,
          disabled: option?.disabled,
        })),
      ];

  return (
    <SelectField
      name={name}
      value={value ?? 'null'}
      onChange={handleChange}
      options={selectOptions}
      placeholder="Select parent"
      disabled={disabled}
      error={error}
      {...props}
    />
  );
};

export default ParentAccountSelect;
