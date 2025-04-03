import SelectField from '@/components/common/atoms/SelectField';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import React, { useEffect } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { MOCK_ACCOUNTS, MOCK_CATEORIES } from '../../utils/constants';
import { DropdownOption } from '../../types';

interface FromSelectProps {
  name: string;
  value?: string;
  onChange?: (target: 'fromAccountId' | 'fromCategoryId', value: string) => void;
  error?: FieldError;
  [key: string]: any;
}

const FromSelectField: React.FC<FromSelectProps> = ({
  name,
  value = '',
  onChange = () => {},
  error,
  ...props
}) => {
  const { watch } = useFormContext();
  const transactionType = watch('type') || 'Expense';

  const [options, setOptions] = React.useState<DropdownOption[]>([]);

  useEffect(() => {
    setOptions(transactionType === 'Income' ? MOCK_CATEORIES : MOCK_ACCOUNTS);
  }, [transactionType]);

  return (
    <FormField
      name="from"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            From <span className="text-red-500">*</span>
          </FormLabel>
          <div className="w-full">
            <SelectField
              className="px-4 py-2"
              name={name}
              value={value}
              onChange={(value) =>
                onChange(transactionType === 'Income' ? 'fromCategoryId' : 'fromAccountId', value)
              }
              options={options}
              placeholder={transactionType === 'Income' ? 'Select Category' : 'Select Account'}
              error={error}
              {...props}
            />
          </div>
        </FormItem>
      )}
    />
  );
};

export default FromSelectField;
