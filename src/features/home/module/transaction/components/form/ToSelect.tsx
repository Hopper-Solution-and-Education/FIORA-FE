import SelectField from '@/components/common/forms/select/SelectField';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import useDataFetch from '@/shared/hooks/useDataFetcher';
import { DropdownOption } from '@/shared/types';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { TransactionType } from '../../types';
import {
  GetSupportDataResponse,
  SupportToAccountResponse,
  SupportToCategoryResponse,
} from '../../types/getSupportDataResponse';

interface ToSelectProps {
  name: string;
  value?: string;
  // onChange?: any;
  error?: FieldError;
  [key: string]: any;
}

const ToSelectField: React.FC<ToSelectProps> = ({
  name,
  value = '',
  // onChange,
  error,
  ...props
}) => {
  const { watch, setValue } = useFormContext();
  const transactionType = watch('type') || 'Expense';
  const selectedOption = watch('toId') || value;

  const [options, setOptions] = React.useState<DropdownOption[]>([]);

  const { data, mutate, isLoading, isValidating } = useDataFetch<GetSupportDataResponse>({
    endpoint: transactionType ? `/api/transactions/supporting-data?type=${transactionType}` : null,
    method: 'GET',
  });

  useEffect(() => {
    if (transactionType) {
      mutate();
    }
  }, [transactionType]);

  useEffect(() => {
    // Get categories case
    const tmpOptions: DropdownOption[] = [];

    if (data && data.data) {
      if (transactionType === TransactionType.Income) {
        [...data.data.toAccounts].forEach((option: SupportToAccountResponse) => {
          tmpOptions.push({
            value: option.id,
            label: option.name,
            icon: option.icon,
          });
        });
      } else if (transactionType === TransactionType.Expense) {
        [...data.data.toCategories].forEach((option: SupportToCategoryResponse) => {
          tmpOptions.push({
            value: option.id,
            label: option.name,
            icon: option.icon,
          });
        });
      } else if (transactionType === TransactionType.Transfer) {
        [...data.data.fromAccounts].forEach((option: SupportToAccountResponse) => {
          tmpOptions.push({
            value: option.id,
            label: option.name,
            icon: option.icon,
          });
        });
      }
    } else {
      tmpOptions.push({
        label: transactionType === TransactionType.Expense ? 'Select Category' : 'Select Account',
        value: 'none',
        disabled: true,
      });
    }
    setOptions(tmpOptions);

    return () => {
      setOptions([]);
    };
  }, [data, transactionType]);

  const handleChange = (value: string) => {
    setValue('toId', value);
  };

  return (
    <FormField
      name="toId"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            To <span className="text-red-500">*</span>
          </FormLabel>
          <div className="w-full h-fit relative">
            {(isLoading || isValidating) && (
              <div className="w-fit h-fit absolute top-[50%] right-[10%] -translate-y-[50%] z-10">
                <Loader2 className="h-5 w-5 text-primary animate-spin opacity-50 mb-4" />
              </div>
            )}
            <SelectField
              className="w-full flex justify-between "
              name={name}
              disabled={isLoading || isValidating}
              value={selectedOption}
              onChange={handleChange}
              options={
                options.length > 0
                  ? options
                  : [{ value: 'loading', label: 'Loading...', disabled: true }]
              }
              placeholder={
                transactionType === TransactionType.Expense ? 'Select Category' : 'Select Account'
              }
              error={error}
              noneValue={false}
              {...props}
            />
          </div>
        </FormItem>
      )}
    />
  );
};

export default ToSelectField;
