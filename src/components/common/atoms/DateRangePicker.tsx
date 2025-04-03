'use client';

import {
  addDays,
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { FieldError } from 'react-hook-form';

type DateRangePickerProps = {
  date?: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  // label?: string;
  placeholder?: string;
  // required?: boolean;
  // dateFormat?: string;
  // className?: string;
  error?: FieldError;
  pastDaysLimit?: number; // Limit for past days (default 90 days)
  futureDaysLimit?: number; // Limit for future days (default 90 days)
  disablePast?: boolean; // Disable all past dates
  disableFuture?: boolean; // Disable all future dates
};

export default function DateRangePicker(props: DateRangePickerProps) {
  const {
    // label,
    placeholder = 'Select date range',
    // required = false,
    // dateFormat = 'dd/MM/yyyy',
    // className,
    error,
    date,
    onChange,
    pastDaysLimit = 90,
    futureDaysLimit = 90,
    disablePast = false,
    disableFuture = false,
  } = props;

  const id = useId();
  const today = new Date();

  const [month, setMonth] = useState<Date>(date?.to || today);

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
  const lastMonth = {
    from: startOfMonth(subMonths(today, 1)),
    to: endOfMonth(subMonths(today, 1)),
  };
  const lastYear = {
    from: startOfYear(subYears(today, 1)),
    to: endOfYear(subYears(today, 1)),
  };

  const pastLimit = subDays(today, pastDaysLimit);
  const futureLimit = addDays(today, futureDaysLimit);

  const disabledDates = [
    ...(disablePast || pastDaysLimit ? [{ before: disablePast ? today : pastLimit }] : []),
    ...(disableFuture || futureDaysLimit ? [{ after: disableFuture ? today : futureLimit }] : []),
  ];

  return (
    <div className="*:not-first:mt-2">
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full">
            <Button
              id={id}
              variant={'outline'}
              className={cn(
                'group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]',
                !date && 'text-muted-foreground',
                error && 'border-red-500 ring-red-500', // Add red border when error exists
              )}
            >
              <span className={cn('truncate', !date && 'text-muted-foreground')}>
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, 'dd/MM/yyyy')} - {format(date.to, 'dd/MM/yyyy')}
                    </>
                  ) : (
                    format(date.from, 'dd/MM/yyyy')
                  )
                ) : (
                  placeholder
                )}
              </span>
              <CalendarIcon
                size={16}
                className="text-muted-foreground/80 group-hover:text-foreground shrink-0 transition-colors"
                aria-hidden="true"
              />
            </Button>
            {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          {/* <Calendar mode="range" selected={date} onSelect={onChange} /> */}
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
                      onChange(newDate);
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
                      onChange(yesterday);
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
                      onChange(last7Days);
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
                      onChange(last30Days);
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
                      onChange(lastMonth);
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
                      onChange(lastYear);
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
                  onChange(newDate);
                }
              }}
              month={month}
              onMonthChange={setMonth}
              className="p-2"
              disabled={disabledDates}
              classNames={{
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/10 hover:text-primary rounded-md transition-colors cursor-pointer',
                day_selected:
                  'bg-primary text-primary-background hover:bg-primary hover:text-primary-foreground font-bold',
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
                  'bg-foreground text-primary-foreground font-bold ring-2 ring-primary ring-offset-2 rounded-md z-10',
                range_end:
                  'bg-primary text-primary-foreground font-bold ring-2 ring-primary ring-offset-2 rounded-md z-10',
                range_middle:
                  'bg-primary/30 text-foreground hover:bg-primary/40 hover:text-foreground rounded-none',
              }}
              onDayMouseEnter={(day) => {
                // Enable drag selection
                if (date?.from && !date.to) {
                  const newRange = { ...date, to: day };
                  onChange(newRange);
                }
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
