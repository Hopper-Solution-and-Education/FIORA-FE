import SelectField from '@/components/common/forms/select/SelectField';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { DropdownOption } from '@/shared/types';
import { AppDispatch, RootState } from '@/store';
import { TransactionType } from '@prisma/client';
import { AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSupportingData, retryFetchSupportingData } from '../../slices/createTransactionSlice';
import { SupportToAccountResponse } from '../../types';

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
  const dispatch = useDispatch<AppDispatch>();
  const { watch, setValue } = useFormContext();
  const transactionType = watch('type') || 'Expense';
  const selectedOption = watch('toId') || value;

  const {
    data: supportingData,
    isLoading,
    error: fetchError,
    lastFetchedType,
  } = useSelector((state: RootState) => state.createTransaction.supportingData);

  // Process options based on transaction type and data
  const options = useMemo((): DropdownOption[] => {
    // If we're still loading or data doesn't match current type, show loading state
    if (isLoading || !supportingData || lastFetchedType !== transactionType) {
      return [
        {
          label: transactionType === 'Expense' ? 'Loading categories...' : 'Loading accounts...',
          value: 'loading',
          disabled: true,
        },
      ];
    }

    // If there's an error, show error state
    if (fetchError) {
      return [
        {
          label: 'Error loading options',
          value: 'error',
          disabled: true,
        },
      ];
    }

    // Determine destination data based on transaction type
    let destinationData: Array<{ id: string; name: string; type?: string }> = [];

    if (transactionType === 'Income' || transactionType === 'Transfer') {
      // For Income/Transfer: To should be Accounts (where money goes)
      destinationData = supportingData.toAccounts || [];
      console.log(
        `ToSelect ${transactionType}: Found ${destinationData.length} accounts`,
        destinationData,
      );
    } else if (transactionType === 'Expense') {
      // For Expense: To should be Categories (expense categories)
      destinationData = supportingData.toCategories || [];
      console.log(`ToSelect Expense: Found ${destinationData.length} categories`, destinationData);
    }

    // Build options from destination data
    if (destinationData.length > 0) {
      return destinationData.map((option: SupportToAccountResponse) => ({
        value: option.id,
        label: option.name,
        icon: option.icon,
      }));
    }

    // No data available
    return [
      {
        label:
          transactionType === 'Expense'
            ? 'No expense categories available'
            : 'No accounts available',
        value: 'none',
        disabled: true,
      },
    ];
  }, [supportingData, transactionType, lastFetchedType, isLoading, fetchError]);

  const handleChange = (value: string) => {
    if (value !== 'loading' && value !== 'error' && value !== 'none') {
      setValue('toId', value);
    }
  };

  const handleRetry = () => {
    dispatch(retryFetchSupportingData());
    dispatch(fetchSupportingData(transactionType as TransactionType));
  };

  // Clear selected value when transaction type changes
  useEffect(() => {
    if (selectedOption && selectedOption !== value) {
      // Only clear if the current selection is not compatible with the new type
      const isValidOption = options.some((opt) => opt.value === selectedOption && !opt.disabled);

      if (!isValidOption) {
        setValue('toId', '');
      }
    }
  }, [transactionType, options, selectedOption, setValue, value]);

  return (
    <FormField
      name="toId"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            To <span className="text-red-500">*</span>
          </FormLabel>
          <div className="w-full h-fit relative">
            {isLoading && (
              <div className="w-fit h-fit absolute top-[50%] right-[10%] -translate-y-[50%] z-10">
                <Loader2 className="h-5 w-5 text-primary animate-spin opacity-50 mb-4" />
              </div>
            )}

            {fetchError && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
                <div className="flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Failed to load options for {transactionType}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  className="h-6 px-2 text-red-700 hover:text-red-800"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            )}

            <SelectField
              className="w-full flex flex-col ustify-between "
              name={name}
              disabled={isLoading}
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
