import DatePicker from '@/components/modern-ui/date-picker';
import { cn } from '@/shared/utils';
import { useFormContext, FieldError } from 'react-hook-form';
import React from 'react';

interface DateRangeFromToPickerRHFProps {
  name: string; // This will not be used directly but is required by FormConfig
  nameFrom: string;
  nameTo: string;
  labelFrom?: string;
  labelTo?: string;
  requiredFrom?: boolean;
  requiredTo?: boolean;
  placeholderFrom?: string;
  placeholderTo?: string;
  disabledDateFrom?: (date: Date) => boolean;
  disabledDateTo?: (date: Date) => boolean;
  className?: string;
  modeLabel?: 'row' | 'column';
  showLabels?: boolean;
}

// use for form config
const DateRangeFromToPickerField = ({
  nameFrom,
  nameTo,
  labelFrom,
  labelTo,
  requiredFrom = false,
  requiredTo = false,
  placeholderFrom,
  placeholderTo,
  disabledDateFrom,
  disabledDateTo,
  className,
  modeLabel = 'row',
  showLabels = true,
}: DateRangeFromToPickerRHFProps) => {
  const isLabelRow = modeLabel === 'row';
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const valueFrom = watch(nameFrom);
  const valueTo = watch(nameTo);
  const errorFrom = errors[nameFrom] as FieldError | undefined;
  const errorTo = errors[nameTo] as FieldError | undefined;

  return (
    <div className={cn('flex flex-col md:flex-row gap-3', className)}>
      {/* From Date Picker Section */}
      <div className="flex flex-col flex-1">
        <div className={cn('flex', isLabelRow ? 'items-center gap-2' : 'flex-col gap-1')}>
          {showLabels && (
            <label className={cn('text-sm font-medium', isLabelRow && 'whitespace-nowrap')}>
              {labelFrom ?? 'From'} {requiredFrom && <span className="text-red-500">*</span>}
            </label>
          )}
          <DatePicker
            date={valueFrom}
            setDate={(date) =>
              setValue(nameFrom, date, { shouldValidate: true, shouldDirty: true })
            }
            placeholder={placeholderFrom}
            disabledDate={disabledDateFrom}
            className={cn()}
            error={errorFrom?.message}
          />
        </div>
        {errorFrom && (
          <p className={cn('text-sm text-red-500 min-h-[1.25rem] mt-1')}>{errorFrom.message}</p>
        )}
      </div>

      {/* To Date Picker Section */}
      <div className="flex flex-col flex-1">
        <div className={cn('flex', isLabelRow ? 'items-center gap-2' : 'flex-col gap-1')}>
          {showLabels && (
            <label className={cn('text-sm font-medium', isLabelRow && 'whitespace-nowrap')}>
              {labelTo ?? 'To'} {requiredTo && <span className="text-red-500">*</span>}
            </label>
          )}
          <DatePicker
            date={valueTo}
            setDate={(date) => setValue(nameTo, date, { shouldValidate: true, shouldDirty: true })}
            placeholder={placeholderTo}
            disabledDate={disabledDateTo}
            className={cn()}
            error={errorTo?.message}
          />
        </div>
        {errorTo && (
          <p className={cn('text-sm text-red-500 min-h-[1.25rem] mt-1')}>{errorTo.message}</p>
        )}
      </div>
    </div>
  );
};

export default DateRangeFromToPickerField;
