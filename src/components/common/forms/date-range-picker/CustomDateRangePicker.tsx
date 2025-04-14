'use client';

import { useState, forwardRef, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import GlobalLabel from '../../atoms/GlobalLabel';
import { cn } from '@/shared/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, CircleX } from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';
import { endOfMonth, endOfYear, startOfMonth, startOfYear, subMonths, subYears } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface CustomDateRangePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  dateFormat?: string;
  className?: string;
  error?: any;
  pastDaysLimit?: number; // Limit for past days (default 90 days)
  futureDaysLimit?: number; // Limit for future days (default 90 days)
  disablePast?: boolean; // Disable all past dates
  disableFuture?: boolean; // Disable all future dates
}

const CustomDateRangePicker = forwardRef<HTMLInputElement, CustomDateRangePickerProps>(
  (
    {
      name,
      label,
      placeholder = 'Select date range',
      required = false,
      dateFormat = 'dd/MM/yyyy',
      className,
      error,
      pastDaysLimit = 90,
      futureDaysLimit = 90,
      disablePast = false,
      disableFuture = false,
    },
    ref,
  ) => {
    const { register, setValue, watch } = useFormContext();
    const selectedRange = watch(name);

    const today = new Date();

    // Initialize with default range (last 7 days)
    const defaultRange = {
      from: subDays(today, 6),
      to: today,
    };

    const [date, setDate] = useState<DateRange | undefined>(
      selectedRange
        ? { from: new Date(selectedRange.from), to: new Date(selectedRange.to) }
        : defaultRange,
    );
    const [month, setMonth] = useState<Date>(date?.to || today);

    // Preset date ranges
    const yesterday = {
      from: subDays(today, 1),
      to: subDays(today, 1),
    };
    const last7Days = {
      from: subDays(today, 6),
      to: today,
    };
    const last30Days = {
      from: subDays(today, 29),
      to: today,
    };
    const monthToDate = {
      from: startOfMonth(today),
      to: today,
    };
    const lastMonth = {
      from: startOfMonth(subMonths(today, 1)),
      to: endOfMonth(subMonths(today, 1)),
    };
    const yearToDate = {
      from: startOfYear(today),
      to: today,
    };
    const lastYear = {
      from: startOfYear(subYears(today, 1)),
      to: endOfYear(subYears(today, 1)),
    };

    // Calculate disabled dates based on limits
    const pastLimit = subDays(today, pastDaysLimit);
    const futureLimit = addDays(today, futureDaysLimit);

    const disabledDates = [
      ...(disablePast || pastDaysLimit ? [{ before: disablePast ? today : pastLimit }] : []),
      ...(disableFuture || futureDaysLimit ? [{ after: disableFuture ? today : futureLimit }] : []),
    ];

    useEffect(() => {
      if (date) {
        setValue(name, date, { shouldValidate: true, shouldDirty: true });
      }
    }, [date, name, setValue]);

    const formatDateRange = (range?: DateRange) => {
      if (!range?.from) return placeholder;
      if (!range.to) return format(range.from, dateFormat);
      return `${format(range.from, dateFormat)} - ${format(range.to, dateFormat)}`;
    };

    return (
      <div className="space-y-2">
        {label && <GlobalLabel text={label} required={required} htmlFor={name} />}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'relative w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
                className,
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 opacity-60" />
              {formatDateRange(date)}
              {date !== undefined && (
                <Button
                  variant={'ghost'}
                  onClick={() => setDate(undefined)}
                  className="absolute right-0 top-[50%] -translate-y-1/2 opacity-80"
                >
                  <CircleX size={15} />
                </Button>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="flex max-sm:flex-col rounded-md border">
              <div className="relative py-4 max-sm:order-1 max-sm:border-t sm:w-32">
                <div className="h-full sm:border-e">
                  <div className="flex flex-col px-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        const newDate = {
                          from: today,
                          to: today,
                        };
                        setDate(newDate);
                        setMonth(today);
                      }}
                    >
                      Today
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(yesterday);
                        setMonth(yesterday.to);
                      }}
                    >
                      Yesterday
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(last7Days);
                        setMonth(last7Days.to);
                      }}
                    >
                      Last 7 days
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(last30Days);
                        setMonth(last30Days.to);
                      }}
                    >
                      Last 30 days
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(monthToDate);
                        setMonth(monthToDate.to);
                      }}
                    >
                      Month to date
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(lastMonth);
                        setMonth(lastMonth.to);
                      }}
                    >
                      Last month
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(yearToDate);
                        setMonth(yearToDate.to);
                      }}
                    >
                      Year to date
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => {
                        setDate(lastYear);
                        setMonth(lastYear.to);
                      }}
                    >
                      Last year
                    </Button>
                  </div>
                </div>
              </div>
              <Calendar
                mode="range"
                selected={date}
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                  }
                }}
                month={month}
                onMonthChange={setMonth}
                className="p-2"
                disabled={disabledDates}
                classNames={{
                  day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/10 hover:text-primary rounded-md transition-colors cursor-pointer',
                  day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground font-bold',
                  day_today: 'bg-accent text-accent-foreground',
                  day_range_middle:
                    'bg-primary/30 text-foreground hover:bg-primary/40 hover:text-foreground rounded-none',
                  day_range_end: 'bg-primary text-primary-foreground rounded-md font-bold',
                  day_range_start: 'bg-primary text-primary-foreground rounded-md font-bold',
                }}
                showOutsideDays={false}
                modifiers={{
                  range_start: (day: Date): boolean => {
                    if (!date?.from) return false;
                    return day.getTime() === date.from.getTime();
                  },
                  range_end: (day: Date): boolean => {
                    if (!date?.to) return false;
                    return day.getTime() === date.to.getTime();
                  },
                  range_middle: (day: Date): boolean => {
                    if (!date?.from || !date?.to) return false;
                    return day.getTime() > date.from.getTime() && day.getTime() < date.to.getTime();
                  },
                }}
                modifiersClassNames={{
                  range_start:
                    'bg-foreground text-primary-background font-bold ring-2 ring-primary ring-offset-2 rounded-md z-10',
                  range_end:
                    'bg-primary text-primary-foreground font-bold ring-2 ring-primary ring-offset-2 rounded-md z-10',
                  range_middle:
                    'bg-primary/30 text-foreground hover:bg-primary/40 hover:text-foreground rounded-none',
                }}
                onDayMouseEnter={(day) => {
                  // Enable drag selection
                  if (date?.from && !date.to) {
                    const newRange = { ...date, to: day };
                    setDate(newRange);
                  }
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
        <input type="hidden" {...register(name)} ref={ref} />
        {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
      </div>
    );
  },
);

CustomDateRangePicker.displayName = 'CustomDateRangePicker';

export default CustomDateRangePicker;
