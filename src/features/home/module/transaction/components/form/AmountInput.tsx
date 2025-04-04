import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldError } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';

interface AmountInputProps {
  value?: number;
  onChange?: (value: number) => void;
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
}) => (
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
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              onBlur={onBlur}
              placeholder={placeholder}
              id={id}
              type={type}
              className={error ? 'border-red-500' : ''}
              {...props}
            />
          </div>
        </div>
        <div className="w-[80%] flex flex-col justify-between items-start overflow-y-hidden overflow-x-auto">
          {/* Increate button group */}
          {value && value > 0 && (
            <div className="w-full h-11 flex justify-evenly items-center gap-2 py-2">
              <Button
                variant={'secondary'}
                className="w-full h-full"
                onClick={() => onChange(value * 10)}
              >
                {value * 10}
              </Button>
              <Button
                variant={'secondary'}
                className="w-full h-full"
                onClick={() => onChange(value * 100)}
              >
                {value * 100}
              </Button>
              <Button
                variant={'secondary'}
                className="w-full h-full"
                onClick={() => onChange(value * 1000)}
              >
                {value * 1000}
              </Button>
              <Button
                variant={'secondary'}
                className="w-full h-full"
                onClick={() => onChange(value * 10000)}
              >
                {value * 10000}
              </Button>
            </div>
          )}
        </div>
      </FormItem>
    )}
  />
);

export default AmountInputField;
