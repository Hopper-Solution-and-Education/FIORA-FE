import DateRangePicker from '@/components/common/atoms/DateRangePicker';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import React from 'react';
import { DateRange } from 'react-day-picker';
import { FieldError } from 'react-hook-form';

interface TypeSelectProps {
  value?: DateRange | undefined;
  onChange?: (date: DateRange | undefined) => void;
  error?: FieldError;
  [key: string]: any;
}

const DateSelectField: React.FC<TypeSelectProps> = ({ value, onChange, error }) => {
  return (
    <FormField
      name="date"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Date <span className="text-red-500">*</span>
          </FormLabel>
          <div className="w-full">
            <DateRangePicker
              date={value}
              onChange={onChange ?? (() => {})}
              error={error}
              placeholder={'Select Date'}
            />
          </div>
        </FormItem>
      )}
    />
  );
};

export default DateSelectField;
