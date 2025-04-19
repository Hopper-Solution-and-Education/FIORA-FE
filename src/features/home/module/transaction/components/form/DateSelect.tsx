import CustomDateTimePicker from '@/components/common/forms/date-time-picker/CustomDateTimePicker';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import React from 'react';

interface TypeSelectProps {
  name: string;
  // value?: Date | undefined;
  // onChange?: any;
  // error?: FieldError;
  [key: string]: any;
}

const DateSelectField: React.FC<TypeSelectProps> = ({ name }) => {
  return (
    <FormField
      name="date"
      render={() => (
        <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
          <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
            Date <span className="text-red-500">*</span>
          </FormLabel>
          <div className="w-full">
            <CustomDateTimePicker
              key={name}
              name={name}
              placeholder="Select date of birth"
              showYearDropdown
              showMonthDropdown
              required
              dropdownMode="select"
              dateFormat="dd/MM/yyyy HH:mm:ss"
              containTimePicker
            />
          </div>
        </FormItem>
      )}
    />
  );
};

export default DateSelectField;
