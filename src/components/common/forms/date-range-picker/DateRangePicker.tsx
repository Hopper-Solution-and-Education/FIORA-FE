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
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/shared/lib/utils';
import type { FieldError } from 'react-hook-form';

type DateRangePickerProps = {
  date?: DateRange | undefined;
  onChange: (date: DateRange | undefined) => void;
  placeholder?: string;
  error?: FieldError;
  pastDaysLimit?: number;
  futureDaysLimit?: number;
  disablePast?: boolean;
  disableFuture?: boolean;
  colorScheme?: 'default' | 'accent' | 'secondary' | 'custom';
  customColor?: string;
};

export default function DateRangePicker(props: DateRangePickerProps) {
  const {
    placeholder = 'Select date range',
    error,
    date,
    onChange,
    pastDaysLimit = 90,
    futureDaysLimit = 90,
    disablePast = false,
    disableFuture = false,
    colorScheme = 'accent',
    customColor,
  } = props;

  const id = useId();
  const today = new Date();

  const [month, setMonth] = useState<Date>(date?.to || today);

  const yesterday = {
    from: subDays(today, 1),
    to: subDays(today.setDate(today.getDate() + 1), 1),
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

  // Define color classes based on the selected color scheme
  const getColorClasses = () => {
    switch (colorScheme) {
      case 'accent':
        return {
          selected: 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground',
          rangeMiddle: 'bg-accent/20 text-accent-foreground hover:bg-accent/30',
          rangeEdge:
            'bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-background hover:bg-accent/90',
        };
      case 'secondary':
        return {
          selected:
            'bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground',
          rangeMiddle: 'bg-secondary/20 text-secondary-foreground hover:bg-secondary/30',
          rangeEdge:
            'bg-secondary text-secondary-foreground ring-2 ring-secondary ring-offset-2 ring-offset-background hover:bg-secondary/90',
        };
      case 'custom':
        return {
          selected: customColor
            ? `bg-[${customColor}] text-white hover:bg-[${customColor}]/90 hover:text-white`
            : 'bg-accent text-accent-foreground',
          rangeMiddle: customColor
            ? `bg-[${customColor}]/20 text-foreground hover:bg-[${customColor}]/30`
            : 'bg-accent/20 text-accent-foreground',
          rangeEdge: customColor
            ? `bg-[${customColor}] text-white ring-2 ring-[${customColor}] ring-offset-2 ring-offset-background hover:bg-[${customColor}]/90`
            : 'bg-accent text-accent-foreground',
        };
      default:
        return {
          selected:
            'bg-primary/50 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground',
          rangeMiddle: 'bg-primary/20 text-primary-foreground hover:bg-primary/30',
          rangeEdge:
            'bg-primary/50 text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background hover:bg-primary/80',
        };
    }
  };

  const colorClasses = getColorClasses();

  return (
    <div className="*:not-first:mt-2">
      <style jsx global>{`
        .day-range-start {
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          z-index: 20;
        }
        .day-range-end {
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
          z-index: 20;
        }
        .day-range-middle {
          border-radius: 0 !important;
          z-index: 10;
          margin-left: -1px;
          margin-right: -1px;
        }
        /* Ensure continuous appearance for the range */
        .rdp-day {
          position: relative;
        }
        .rdp-day_range_middle {
          border-left: 1px solid rgba(0, 0, 0, 0.1);
          border-right: 1px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
      <Popover>
        <PopoverTrigger asChild>
          <div className="w-full">
            <Button
              id={id}
              variant={'outline'}
              className={cn(
                'group bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]',
                !date && 'text-muted-foreground',
                error && 'border-red-500 ring-red-500',
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
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors cursor-pointer text-foreground/70',
                day_selected: `${colorClasses.selected} font-semibold`,
                day_today: 'bg-accent/50 text-accent-foreground font-semibold',
                day_range_middle: `${colorClasses.rangeMiddle} rounded-none`,
                day_range_end: `${colorClasses.selected} rounded-r-md font-semibold`,
                day_range_start: `${colorClasses.selected} rounded-l-md font-semibold`,
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
                range_start: `${colorClasses.rangeEdge} rounded-l-md`,
                range_end: `${colorClasses.rangeEdge} rounded-r-md`,
                range_middle: `${colorClasses.rangeMiddle} rounded-none`,
              }}
              onDayMouseEnter={(day) => {
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
