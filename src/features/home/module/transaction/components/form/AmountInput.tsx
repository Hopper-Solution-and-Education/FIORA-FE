import InputCurrency from '@/components/common/forms/input/InputCurrency';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import React from 'react';
import { FieldError, useFormContext } from 'react-hook-form';

interface AmountInputProps {
  value?: number;
  onChange?: any;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  placeholder?: string;
  id?: string;
  [key: string]: any;
}

const AmountInputField: React.FC<AmountInputProps> = ({
  value = 1,
  onChange = () => {},
  onBlur,
  error,
  label,
  placeholder,
  id,
  ...props
}) => {
  const { watch } = useFormContext();
  const amountCurrency: string = watch('currency') || '';

  return (
    <FormField
      name="amount"
      render={() => (
        <FormItem className="w-full flex flex-col justify-start items-end">
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              {label ? label : 'Amount'} <span className="text-red-500">*</span>
            </FormLabel>
            <div className="w-full flex flex-col justify-between">
              <InputCurrency
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                id={id}
                currency={amountCurrency}
                error={error}
                showSuggestion={true}
                mode="onChange"
                classContainer="mb-0"
                className={error ? 'border-red-500' : ''}
                {...props}
              />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default AmountInputField;
