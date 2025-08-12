import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldError } from 'react-hook-form';
import SelectField from '@/components/common/forms/select/SelectField';
import { AccountType } from '@prisma/client';

interface ParentAccountSelectProps {
  name: string;
  options: { value: string; label: string; icon?: string; disabled?: boolean; type: AccountType }[];
  disabled: boolean;
  value?: string;
  error?: FieldError;
  [key: string]: any;
}

const ParentAccountSelect: React.FC<ParentAccountSelectProps> = ({
  name,
  options,
  disabled,
  value,
  error,
  ...props
}) => {
  const { getValues, setValue, trigger } = useFormContext();

  // If this is a sub-account (has parentId), we should show the parent's name
  const currentParentId = getValues('parentId');
  const currentParentName = getValues('parentName');

  const selectOptions = disabled
    ? [{ value: currentParentId || 'null', label: currentParentName || 'Parent locked' }]
    : [
        ...options.map((option) => ({
          value: option.value,
          label: option.label,
          icon: option?.icon,
          disabled: option?.disabled,
        })),
      ];

  useEffect(() => {
    const handleParentChange = (value: string) => {
      if (value === 'null') {
        setValue('type', null);
        return;
      }

      // Find the selected parent option to get its type
      const selectedParent = options.find((option) => option.value === value);
      if (selectedParent) {
        setValue('type', selectedParent.type);
        trigger('type');
      }
    };

    handleParentChange(currentParentId);
  }, [currentParentId]);

  return (
    <SelectField
      name={name}
      value={value || currentParentId || 'null'}
      options={selectOptions}
      noneValue={false}
      placeholder="Select parent"
      disabled={disabled}
      error={error}
      {...props}
    />
  );
};

export default ParentAccountSelect;
