import { DateTimePicker } from '@/components/common/forms/date-time-picker/DateTimePicker';
import SelectField from '@/components/common/forms/select/SelectField';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DropdownOption } from '@/shared/types';
import React, { useEffect, useState } from 'react';
import { FieldError, useFormContext } from 'react-hook-form';
import { TransactionRecurringType } from '../../utils/constants';

interface RecurringSelectProps {
  name: string;
  value?: string;
  // onChange?: any;
  error?: FieldError;
  [key: string]: any;
}

const RecurringSelectField: React.FC<RecurringSelectProps> = ({
  name,
  value = 'None',
  // onChange = () => {},
  error,
  ...props
}) => {
  const { watch, setValue } = useFormContext();
  const currentRecurringType: string = watch('remark') || value;
  const currentDate = watch('date') || value;

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
              className="w-[50%] flex justify-between"
              name={name}
              value={currentRecurringType}
              onValueChange={(value: string) => setValue('remark', value)}
              options={options}
              placeholder={'Select Type'}
              error={error}
              noneValue={false}
              {...props}
            />
            <FormLabel className="w-[10%] text-right text-sm text-gray-700 dark:text-gray-300">
              At
            </FormLabel>
            <div className="w-full h-fit relative">
              <DateTimePicker
                modal={false}
                value={
                  currentRecurringType === TransactionRecurringType.DAILY
                    ? currentDate
                    : recurringDate
                }
                onChange={setRecurringDate}
                clearable
                disabled={
                  currentRecurringType === TransactionRecurringType.NONE ||
                  currentRecurringType === TransactionRecurringType.DAILY
                }
                hideTime // Chỉ hiển thị ngày
              />
            </div>
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
                onValueChange={(value: string) => setRecurringOption(value)}
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
