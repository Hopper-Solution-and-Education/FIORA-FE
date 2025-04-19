import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { TransactionCurrency } from '../../utils/constants';
import { formatCurrency } from '../../hooks/formatCurrency';

interface AmountInputProps {
  value?: number;
  onChange?: any;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  placeholder?: string;
  id?: string;
  type?: string;
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
  type,
  ...props
}) => {
  const { watch } = useFormContext();
  const amountCurrency: TransactionCurrency = watch('currency') || 'VND';
  const [isEditing, setIsEditing] = useState(false);

  const handleOnBlur = () => {
    setIsEditing((prev) => !prev);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    onBlur && onBlur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Allow empty input, digits, and a single decimal point
    const isValidInput = /^$|^[0-9]*\.?[0-9]*$/.test(input);

    if (isValidInput) {
      const newValue = input === '' ? 0 : Number(input);
      if (newValue >= 0) {
        onChange(newValue);
      }
    }
  };

  return (
    <FormField
      name="amount"
      render={() => (
        <FormItem className="w-full flex flex-col justify-start items-end">
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              {label ? label : 'Amount'} <span className="text-red-500">*</span>
            </FormLabel>
            <div className="w-full">
              <Input
                value={isEditing ? value : formatCurrency(value, amountCurrency, false)}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.select();
                  setIsEditing(true);
                }}
                onBlur={handleOnBlur}
                placeholder={placeholder}
                id={id}
                type={type}
                className={error ? 'border-red-500' : ''}
                {...props}
              />
            </div>
          </div>
          {value > 0 && (
            <div className="w-[80%] flex flex-col justify-between items-start overflow-y-hidden overflow-x-auto">
              {/* Increate button group */}
              <div className="w-full h-11 flex justify-evenly items-center gap-2 py-2">
                <Button
                  type="button"
                  variant={'secondary'}
                  className="w-full h-full"
                  onClick={() => onChange(value * 10)}
                >
                  {formatCurrency(value * 10, amountCurrency, true)}
                </Button>
                <Button
                  type="button"
                  variant={'secondary'}
                  className="w-full h-full"
                  onClick={() => onChange(value * 100)}
                >
                  {formatCurrency(value * 100, amountCurrency, true)}
                </Button>
                <Button
                  type="button"
                  variant={'secondary'}
                  className="w-full h-full"
                  onClick={() => onChange(value * 1000)}
                >
                  {formatCurrency(value * 1000, amountCurrency, true)}
                </Button>
                <Button
                  type="button"
                  variant={'secondary'}
                  className="w-full h-full"
                  onClick={() => onChange(value * 10000)}
                >
                  {formatCurrency(value * 10000, amountCurrency, true)}
                </Button>
              </div>
            </div>
          )}
        </FormItem>
      )}
    />
  );
};

export default AmountInputField;
