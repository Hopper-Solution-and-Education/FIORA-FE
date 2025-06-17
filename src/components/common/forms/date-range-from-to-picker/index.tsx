import DatePicker from '@/components/modern-ui/date-picker';
import { cn } from '@/shared/utils';
import { DateRangeFromToPickerProps } from './types';

const DateRangeFromToPicker = ({
  from,
  to,
  className,
  modeLabel = 'row',
  showLabels = true,
}: DateRangeFromToPickerProps) => {
  const isLabelRow = modeLabel === 'row';

  return (
    <div className={cn('flex flex-col md:flex-row gap-3', className)}>
      {/* From Date Picker Section */}
      <div className="flex flex-col flex-1">
        <div className={cn('flex', isLabelRow ? 'items-center gap-2' : 'flex-col gap-1')}>
          {showLabels && (
            <label
              htmlFor="from"
              className={cn('text-sm font-medium', isLabelRow && 'whitespace-nowrap')}
            >
              {from.label ?? 'From'}
            </label>
          )}
          <DatePicker
            date={from.data}
            setDate={from.setFrom}
            placeholder={from.placeholder}
            disabledDate={from.disabledDate}
            className={cn(from.className)}
            error={from.error}
          />
        </div>
        {from.error && <p className={cn('text-sm text-red-500 h-2')}>{from.error}</p>}
      </div>

      {/* To Date Picker Section */}
      <div className="flex flex-col flex-1">
        <div className={cn('flex', isLabelRow ? 'items-center gap-2' : 'flex-col gap-1')}>
          {showLabels && (
            <label
              htmlFor="to"
              className={cn('text-sm font-medium', isLabelRow && 'whitespace-nowrap')}
            >
              {to.label ?? 'To'}
            </label>
          )}
          <DatePicker
            date={to.data}
            setDate={to.setTo}
            placeholder={to.placeholder}
            disabledDate={to.disabledDate}
            className={cn(to.className)}
            error={to.error}
          />
        </div>
        {to.error && <p className={cn('text-sm h-2 text-red-500')}>{to.error}</p>}
      </div>
    </div>
  );
};

export default DateRangeFromToPicker;
