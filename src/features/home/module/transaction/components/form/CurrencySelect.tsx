import SelectField from '@/components/common/forms/select/SelectField';
import React from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { TransactionCurrency } from '../../utils/constants';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

interface TypeSelectProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
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
  const { watch } = useFormContext();
  const isTypeDisabled = watch('isTypeDisabled') || false;

  const options = [
    { value: TransactionCurrency.USD, label: 'USD' },
    { value: TransactionCurrency.VND, label: 'VND' },
  ];

  return (
    <FormField
      name="currency"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Currency <span className="text-red-500">*</span>
          </FormLabel>
          <FormControl>
            <div className="w-full">
              <SelectField
                className="w-full flex justify-between px-4 py-2"
                name={name}
                value={value}
                onChange={onChange}
                options={options}
                placeholder="Select currency"
                disabled={isTypeDisabled}
                error={error}
                {...props}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default TypeSelectField;
