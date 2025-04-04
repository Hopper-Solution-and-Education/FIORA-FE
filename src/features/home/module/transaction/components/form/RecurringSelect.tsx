import { DateTimePicker } from '@/components/common/atoms/DateTimePicker';
import SelectField from '@/components/common/atoms/SelectField';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import React, { useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { TransactionRecurringType } from '../../utils/constants';
import { DropdownOption } from '../../types';

interface RecurringSelectProps {
  name: string;
  value?: string;
  onChange?: any;
  error?: FieldError;
  [key: string]: any;
}

const RecurringSelectField: React.FC<RecurringSelectProps> = ({
  name,
  value = 'None',
  onChange = () => {},
  error,
  ...props
}) => {
  const [recurringDate, setRecurringDate] = useState<Date | undefined>();
  const [recurringOption, setRecurringOption] = useState<string | undefined>();
  const [options, setOptions] = useState<DropdownOption[]>([]);

  useEffect(() => {
    const recurringOptions = Object.values(TransactionRecurringType).map(
      (value: string) =>
        ({
          label: value,
          value: value,
        }) as DropdownOption,
    );
    setOptions(recurringOptions);
  }, []);

  return (
    <>
      <FormField
        name="recurring"
        render={() => (
          <FormItem className="w-full h-fit flex flex-row justify-start items-center gap-4">
            <FormLabel className="w-[32%] text-right text-sm text-gray-700 dark:text-gray-300">
              Recurring
            </FormLabel>
            <SelectField
              className="px-4 py-2"
              name={name}
              value={value}
              onChange={onChange}
              options={options}
              placeholder={'Select Type'}
              error={error}
              {...props}
            />
            <FormLabel className="w-[10%] text-right text-sm text-gray-700 dark:text-gray-300">
              At
            </FormLabel>
            <DateTimePicker
              modal={false}
              value={recurringDate}
              onChange={(date) => setRecurringDate(date)}
              clearable
              hideTime // Chỉ hiển thị ngày
            />
          </FormItem>
        )}
      />

      {/* Recurring Action Select */}
      {value !== TransactionRecurringType.NONE && (
        <FormField
          name="date"
          render={() => (
            <FormItem className="w-full h-fit flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4">
              <FormLabel className="text-right text-sm text-gray-700 dark:text-gray-300 sm:w-[20%]">
                Copy and
              </FormLabel>
              <RadioGroup
                defaultValue={recurringOption}
                className="w-full flex gap-10"
                onValueChange={setRecurringOption}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="do-nothing" id="do-nothing" />
                  <Label htmlFor="do-nothing">Do nothing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="copy" id="copy" />
                  <Label htmlFor="copy">Copy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new">New</Label>
                </div>
              </RadioGroup>
            </FormItem>
          )}
        />
      )}
    </>
  );
};

export default RecurringSelectField;
