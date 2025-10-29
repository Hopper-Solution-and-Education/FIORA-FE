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
import { cn } from '@/shared/utils';
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

  // Corrected to ensure date operations don't mutate the original 'today' object
  const yesterday = {
    from: subDays(today, 1),
    to: subDays(new Date(), 1), // Use new Date() for today's date if needed for 'to'
  };
  const last7Days = {
    from: subDays(today, 6),
    to: today,
  };
  const last30Days = {
    from: subDays(today, 29),
    to: today,
  };
  const last90Days = {
    from: subDays(today, 89),
    to: today,
  };
  const last180Days = {
    from: subDays(today, 179),
    to: today,
  };
  const last365Days = {
    from: subDays(today, 364),
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
    ...(disablePast ? [{ before: today }] : []), // If disablePast is true, disable everything before today
    ...(pastDaysLimit && !disablePast ? [{ before: pastLimit }] : []), // If pastDaysLimit exists and disablePast is false, apply that limit
    ...(disableFuture ? [{ after: today }] : []), // If disableFuture is true, disable everything after today
    ...(futureDaysLimit && !disableFuture ? [{ after: futureLimit }] : []), // If futureDaysLimit exists and disableFuture is false, apply that limit
  ];

  // Define color classes and inline styles based on the selected color scheme
  const getColorSchemeStyles = () => {
    switch (colorScheme) {
      case 'accent':
        return {
          selectedClasses:
            'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground',
          rangeMiddleClasses: 'bg-accent/20 text-accent-foreground hover:bg-accent/30',
          rangeEdgeClasses: 'bg-accent text-accent-foreground hover:bg-accent/90',
          selectedStyle: {},
          rangeMiddleStyle: {},
          rangeEdgeStyle: {},
        };
      case 'secondary':
        return {
          selectedClasses:
            'bg-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground',
          rangeMiddleClasses: 'bg-secondary/20 text-secondary-foreground hover:bg-secondary/30',
          rangeEdgeClasses: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
          selectedStyle: {},
          rangeMiddleStyle: {},
          rangeEdgeStyle: {},
        };
      case 'custom':
        // For 'custom', we rely heavily on inline styles for dynamic colors
        // Tailwind JIT can struggle with arbitrary values in class names determined at runtime
        return {
          selectedClasses: '', // Use inline styles for custom color
          rangeMiddleClasses: '', // Use inline styles for custom color
          rangeEdgeClasses: '', // Use inline styles for custom color
          selectedStyle: customColor ? { backgroundColor: customColor, color: 'white' } : {},
          rangeMiddleStyle: customColor
            ? { backgroundColor: `${customColor}33`, color: 'inherit' } // Adding '33' for 20% opacity on hex
            : {},
          rangeEdgeStyle: customColor
            ? {
                backgroundColor: customColor,
                color: 'white',
                '--tw-ring-color': customColor, // Ensure ring color is set
              }
            : {},
        };
      default:
        // Default to primary theme, as you had it as 'primary/50' for selected previously
        return {
          selectedClasses:
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground', // Changed to full primary for selected
          rangeMiddleClasses: 'bg-primary/20 text-foreground hover:bg-primary/30',
          rangeEdgeClasses: 'bg-primary text-primary-foreground hover:bg-primary/90', // Changed to full primary for range edge
          selectedStyle: { color: 'white !important' },
          rangeMiddleStyle: {},
          rangeEdgeStyle: {},
        };
    }
  };

  const {
    selectedClasses,
    rangeMiddleClasses,
    rangeEdgeClasses,
    selectedStyle,
    rangeMiddleStyle,
    rangeEdgeStyle,
  } = getColorSchemeStyles();

  return (
    <div className="*:not-first:mt-2">
      <style jsx global>{`
        /* Styles to ensure the range looks continuous and correctly rounded */
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
          /* Adjust margins to prevent gaps between days in the range */
          margin-left: -1px;
          margin-right: -1px;
        }
        /* Visual continuity for the middle range */
        .rdp-day_range_middle {
          border-left: 1px solid rgba(0, 0, 0, 0.05); /* Very subtle border to help continuity */
          border-right: 1px solid rgba(0, 0, 0, 0.05); /* Helps fill tiny gaps */
        }
        /* Ensure the z-index for selected days at range ends is higher */
        .rdp-day_range_start.rdp-day_selected,
        .rdp-day_range_end.rdp-day_selected {
          z-index: 20;
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
                      onChange(last90Days);
                      setMonth(last90Days.to);
                    }}
                  >
                    Last 90 days
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      onChange(last180Days);
                      setMonth(last180Days.to);
                    }}
                  >
                    Last 180 days
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      onChange(last365Days);
                      setMonth(last365Days.to);
                    }}
                  >
                    Last 365 days
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
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md transition-colors cursor-pointer',
                day_selected: cn(selectedClasses, 'font-semibold'),
                day_today: 'bg-accent/50 text-accent-foreground font-semibold',
                // Important: Apply classes to day_range_middle for the range fill
                day_range_middle: cn(rangeMiddleClasses, 'rounded-none relative z-10'),
                day_range_end: cn(selectedClasses, 'rounded-md font-semibold relative z-20'),
                day_range_start: cn(selectedClasses, 'rounded-md font-semibold relative z-20'),
              }}
              styles={{
                day_selected: selectedStyle,
                // Important: Apply inline styles to day_range_middle for the range fill
                day_range_middle: rangeMiddleStyle,
                day_range_start: rangeEdgeStyle,
                day_range_end: rangeEdgeStyle,
              }}
              showOutsideDays={false}
              // Modifiers are used to tell react-day-picker which days fall into which category
              modifiers={{
                range_start: (day: Date): boolean => {
                  if (!date?.from) return false;
                  return day.toDateString() === date.from.toDateString(); // Compare dates without time
                },
                range_end: (day: Date): boolean => {
                  if (!date?.to) return false;
                  return day.toDateString() === date.to.toDateString(); // Compare dates without time
                },
                range_middle: (day: Date): boolean => {
                  if (!date?.from || !date?.to) return false;
                  // Ensure comparison is only by date, not time
                  const fromTime = date.from.getTime();
                  const toTime = date.to.getTime();
                  const dayTime = day.getTime();
                  return dayTime > fromTime && dayTime < toTime;
                },
              }}
              modifiersClassNames={{
                range_start: cn(rangeEdgeClasses, 'relative z-20'),
                range_end: cn(rangeEdgeClasses, 'relative z-20'),
                range_middle: cn(rangeMiddleClasses, 'relative z-10'),
              }}
              onDayMouseEnter={(day) => {
                // This logic creates a temporary range visualization while dragging
                if (date?.from && !date.to) {
                  // Only update if 'from' is set and 'to' is not yet set
                  if (day.getTime() >= date.from.getTime()) {
                    // Ensure 'to' is not before 'from'
                    const newRange = { ...date, to: day };
                    onChange(newRange);
                  } else {
                    // If hovered day is before 'from', adjust 'from' and 'to'
                    const newRange = { from: day, to: date.from };
                    onChange(newRange);
                  }
                }
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
