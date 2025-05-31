import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldError } from 'react-hook-form';
import SelectField, { Option } from '@/components/common/forms/select/SelectField';

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
  const parentId = watch('parentId');
  const isSelectParentId: boolean = Boolean(parentId !== 'null' && parentId);

  return (
    <SelectField
      name={name}
      value={value}
      onChange={onChange}
      options={options}
      noneValue={false}
      placeholder="Select type"
      disabled={isSelectParentId || options.every((option) => option.disabled)}
      error={error}
      {...props}
    />
  );
};

export default AccountTypeSelect;
