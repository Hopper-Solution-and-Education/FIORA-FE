import { DateTimePicker } from '@/components/common/forms';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface TypeSelectProps {
  name: string;
  startMonth?: Date;
  endMonth?: Date;
  [key: string]: any;
}

const DateSelectField: React.FC<TypeSelectProps> = ({ name, min, max, yearRange }) => {
  const { control } = useFormContext();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Date <span className="text-red-500">*</span>
          </FormLabel>
          <div className="w-full">
            <DateTimePicker
              value={field.value || undefined}
              onChange={field.onChange}
              required
              modal={true}
              min={min}
              max={max}
              showTodayButton={true}
              yearRange={yearRange}
            />
          </div>
        </FormItem>
      )}
    />
  );
};

export default DateSelectField;
