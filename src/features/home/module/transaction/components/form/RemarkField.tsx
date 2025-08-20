import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import React from 'react';
import { FieldError } from 'react-hook-form';

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

const RemarkField: React.FC<AmountInputProps> = ({ error, label, placeholder, id, ...props }) => {
  return (
    <FormField
      name="remark"
      render={({ field }) => (
        <FormItem className="w-full flex flex-col justify-start items-end">
          <div className="w-full flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 ">
            <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
              {label ? label : 'Description'} <span className="text-red-500">*</span>
            </FormLabel>
            <div className="w-full">
              <Input onBlur={field.onBlur} placeholder={placeholder} id={id} {...props} />
              {error && <p className="text-red-500">{error.message}</p>}
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default RemarkField;
