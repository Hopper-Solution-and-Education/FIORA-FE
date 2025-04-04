import SelectField from '@/components/common/atoms/SelectField';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import useDataFetcher from '@/hooks/useDataFetcher';
import { Account, Category } from '@prisma/client';
import React, { useEffect } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { DropdownOption } from '../../types';

interface FromSelectProps {
  name: string;
  value?: string;
  onChange?: any;
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
  const [targetEndpoint, setTargetEndpoint] = React.useState<string | null>(null);

  const { data, mutate } = useDataFetcher<any>({
    endpoint: targetEndpoint,
    method: 'GET',
  });

  useEffect(() => {
    if (transactionType === 'Income') {
      setTargetEndpoint('/api/categories/expense-incomes');
    } else {
      setTargetEndpoint('/api/accounts/lists');
    }
    mutate(undefined, {
      revalidate: true,
    });
  }, [transactionType]);

  useEffect(() => {
    // Get categories case
    const tmpOptions: DropdownOption[] = [];

    if (data && data.data && transactionType === 'Income') {
      data.data.forEach((category: Category) => {
        tmpOptions.push({
          value: category.id,
          label: category.name,
        });
      });
    } else if (data && data.data && transactionType !== 'Income') {
      data.data.forEach((account: Account) => {
        tmpOptions.push({
          value: account.id,
          label: account.name,
        });
      });
    } else {
      tmpOptions.push({
        label: transactionType === 'Income' ? 'Select Category' : 'Select Account',
        value: 'none',
        disabled: true,
      });
    }
    setOptions(tmpOptions);
    return () => {
      setOptions([]);
    };
  }, [data]);

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
              value={options.find((option) => option.value === value)?.label || ''}
              onChange={onChange}
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
