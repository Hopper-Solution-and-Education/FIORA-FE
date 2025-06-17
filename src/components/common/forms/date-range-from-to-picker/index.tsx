import DatePicker from '@/components/modern-ui/date-picker';
import { cn } from '@/shared/utils';
import { DateRangeFromToPickerProps } from './types';

const DateRangeFromToPicker = ({
  from, // Destructure 'from' object directly
  to,
  className,
  modeLabel = 'row',
  showLabels = true,
}: DateRangeFromToPickerProps) => {
  const isLabelRow = modeLabel === 'row';

  const fromRequired = from.required ?? false;
  const toRequired = to.required ?? false;

  return (
    <div className={cn('flex flex-col md:flex-row gap-3', className)}>
      {/* From Date Picker Section */}
      <div className="flex flex-col flex-1">
        <div className={cn('flex', isLabelRow ? 'items-center gap-2' : 'flex-col gap-1')}>
          {showLabels && (
            <label className={cn('text-sm font-medium', isLabelRow && 'whitespace-nowrap')}>
              {from.label ?? 'From'} {fromRequired && <span className="text-red-500">*</span>}
            </label>
          )}
          <DatePicker
            date={from.value}
            setDate={from.onChange}
            placeholder={from.placeholder}
            disabledDate={from.disabledDate}
            className={cn(from.className)}
            error={from.error?.message}
          />
        </div>
        {from.error && (
          <p className={cn('text-sm text-red-500 min-h-[1.25rem] mt-1')}>{from.error.message}</p>
        )}
      </div>

      {/* To Date Picker Section */}
      <div className="flex flex-col flex-1">
        <div className={cn('flex', isLabelRow ? 'items-center gap-2' : 'flex-col gap-1')}>
          {showLabels && (
            <label className={cn('text-sm font-medium', isLabelRow && 'whitespace-nowrap')}>
              {to.label ?? 'To'} {toRequired && <span className="text-red-500">*</span>}
            </label>
          )}
          <DatePicker
            date={to.value}
            setDate={to.onChange}
            placeholder={to.placeholder}
            disabledDate={to.disabledDate}
            className={cn(to.className)}
            error={to.error?.message}
          />
        </div>
        {to.error && (
          <p className={cn('text-sm text-red-500 min-h-[1.25rem] mt-1')}>{to.error.message}</p>
        )}
      </div>
    </div>
  );
};

export default DateRangeFromToPicker;
