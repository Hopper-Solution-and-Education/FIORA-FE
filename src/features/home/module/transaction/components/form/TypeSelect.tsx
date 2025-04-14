import SelectField from '@/components/common/atoms/SelectField';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import React from 'react';
import { FieldError } from 'react-hook-form';

interface TypeSelectProps {
  name: string;
  value?: string;
  onChange?: any;
  error?: FieldError;
  [key: string]: any;
}

const TypeSelectField: React.FC<TypeSelectProps> = ({
  name,
  value = '',
  onChange = () => {},
  error,
  ...props
}) => {
  const options = [
    { value: 'Expense', label: 'Expense' },
    { value: 'Income', label: 'Income' },
    { value: 'Transfer', label: 'Transfer' },
  ];

  return (
    <FormField
      name="type"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Type <span className="text-red-500">*</span>
          </FormLabel>
          <div className="w-full">
            <SelectField
              className="px-4 py-2"
              name={name}
              value={value}
              onChange={onChange}
              options={options}
              placeholder="Select transaction type"
              error={error}
              {...props}
            />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TypeSelectField;
