'use client';

import { cx } from '@/lib/date-picker-utils/cx';
import { focusInput } from '@/lib/date-picker-utils/focusInput';
import { focusRing } from '@/lib/date-picker-utils/focusRing';
import { hasErrorInput } from '@/lib/date-picker-utils/hasErrorInput';
import * as PopoverPrimitives from '@radix-ui/react-popover';
import { format, getYear, isSameMonth, setMonth, setYear, type Locale } from 'date-fns';
import { enUS } from 'date-fns/locale';
import React from 'react';
import {
  DayPicker,
  Matcher,
  useDayPicker,
  useDayRender,
  useNavigation,
  type DayPickerSingleProps,
  type DayProps,
} from 'react-day-picker';
import { tv, VariantProps } from 'tailwind-variants';
import { Button } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

//#region Tremor Custom Birth Date Calendar
interface NavigationButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  icon: React.ElementType;
  disabled?: boolean;
}

const NavigationButton = React.forwardRef<HTMLButtonElement, NavigationButtonProps>(
  ({ onClick, icon, disabled, ...props }: NavigationButtonProps, forwardedRef) => {
    const Icon = icon;
    return (
      <button
        ref={forwardedRef}
        type="button"
        disabled={disabled}
        className={cx(
          'flex size-8 shrink-0 select-none items-center justify-center rounded border p-1 outline-none transition sm:size-[30px]',
          // text color
          'text-gray-600 hover:text-gray-800',
          'dark:text-gray-400 hover:dark:text-gray-200',
          // border color
          'border-gray-300 dark:border-gray-800',
          // background color
          'hover:bg-gray-50 active:bg-gray-100',
          'hover:dark:bg-gray-900 active:dark:bg-gray-800',
          // disabled
          'disabled:pointer-events-none',
          'disabled:border-gray-200 disabled:dark:border-gray-800',
          'disabled:text-gray-400 disabled:dark:text-gray-600',
          focusRing,
        )}
        onClick={onClick}
        {...props}
      >
        <Icon className="size-full shrink-0" />
      </button>
    );
  },
);

NavigationButton.displayName = 'NavigationButton';

type OmitKeys<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

type KeysToOmit = 'showWeekNumber' | 'captionLayout' | 'mode';

type SingleProps = OmitKeys<DayPickerSingleProps, KeysToOmit>;

type CalendarProps =
  | ({
      mode: 'single';
    } & SingleProps)
  | ({
      mode?: undefined;
    } & SingleProps);

const CalendarPrimitive = React.memo(
  ({
    weekStartsOn = 1,
    numberOfMonths = 1,
    disableNavigation,
    locale,
    mode,
    className,
    classNames,
    ...props
  }: CalendarProps) => {
    return (
      <DayPicker
        weekStartsOn={weekStartsOn}
        numberOfMonths={numberOfMonths}
        locale={locale}
        showOutsideDays={numberOfMonths === 1}
        className={cx(className)}
        classNames={{
          months: 'flex space-y-0',
          month: 'space-y-4 p-3',
          nav: 'gap-1 flex items-center rounded-full size-full justify-between p-4',
          table: 'w-full border-collapse space-y-1',
          head_cell:
            'w-9 font-medium text-sm sm:text-xs text-center text-gray-400 dark:text-gray-600 pb-2',
          row: 'w-full mt-0.5',
          cell: cx(
            'relative p-0 text-center focus-within:relative',
            'text-gray-900 dark:text-gray-50',
          ),
          day: cx(
            'size-9 rounded text-sm focus:z-10',
            'text-gray-900 dark:text-gray-50',
            'hover:bg-gray-200 hover:dark:bg-gray-700',
            focusRing,
          ),
          day_today: 'font-semibold',
          day_selected: cx(
            'rounded',
            'aria-selected:bg-gray-900 aria-selected:text-gray-50',
            'dark:aria-selected:bg-gray-50 dark:aria-selected:text-gray-900',
          ),
          day_disabled:
            '!text-gray-300 dark:!text-gray-700 line-through disabled:hover:bg-transparent',
          day_outside: 'text-gray-400 dark:text-gray-600',
          day_range_middle: cx(
            '!rounded-none',
            'aria-selected:!bg-gray-100 aria-selected:!text-gray-900',
            'dark:aria-selected:!bg-gray-900 dark:aria-selected:!text-gray-50',
          ),
          day_range_start: 'rounded-r-none !rounded-l',
          day_range_end: 'rounded-l-none !rounded-r',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
          IconLeft: () => (
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
              ,
            </svg>
          ),
          IconRight: () => (
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          ),
          Caption: ({ displayMonth }) => {
            const { goToMonth, nextMonth, previousMonth, displayMonths } = useNavigation();
            const { numberOfMonths } = useDayPicker();

            const displayIndex = displayMonths.findIndex((month) =>
              isSameMonth(displayMonth, month),
            );
            const isFirst = displayIndex === 0;
            const isLast = displayIndex === displayMonths.length - 1;

            const hideNextButton = numberOfMonths > 1 && (isFirst || !isLast);
            const hidePreviousButton = numberOfMonths > 1 && (isLast || !isFirst);

            const currentSelectedYear = getYear(displayMonth);
            const currentYear = getYear(new Date());
            const years = Array.from({ length: 101 }, (_, i) => currentYear - 100 + i);

            return (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <>
                    <Select
                      name="Select year"
                      value={currentSelectedYear.toString()}
                      onValueChange={(value) => goToMonth(setYear(displayMonth, parseInt(value)))}
                    >
                      <SelectTrigger className="h-8 w-[100px] px-2 py-1">
                        <SelectValue placeholder="Select Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      name="Select month"
                      value={displayMonth.getMonth().toString()}
                      onValueChange={(value) => goToMonth(setMonth(displayMonth, parseInt(value)))}
                    >
                      <SelectTrigger className="h-8 w-[120px] px-2 py-1">
                        <SelectValue placeholder="Select Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          'January',
                          'February',
                          'March',
                          'April',
                          'May',
                          'June',
                          'July',
                          'August',
                          'September',
                          'October',
                          'November',
                          'December',
                        ].map((month, index) => (
                          <SelectItem key={month} value={index.toString()}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </>
                </div>
                <div className="flex items-center gap-1">
                  {!hidePreviousButton && (
                    <NavigationButton
                      disabled={disableNavigation || !previousMonth}
                      aria-label="Go to previous month"
                      onClick={() => previousMonth && goToMonth(previousMonth)}
                      icon={() => (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                            fill="currentColor"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      )}
                    />
                  )}
                  {!hideNextButton && (
                    <NavigationButton
                      disabled={disableNavigation || !nextMonth}
                      aria-label="Go to next month"
                      onClick={() => nextMonth && goToMonth(nextMonth)}
                      icon={() => (
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z"
                            fill="currentColor"
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      )}
                    />
                  )}
                </div>
              </div>
            );
          },
          Day: ({ date, displayMonth }: DayProps) => {
            const buttonRef = React.useRef<HTMLButtonElement>(
              null,
            ) as React.RefObject<HTMLButtonElement>;
            const { activeModifiers, buttonProps, divProps, isButton, isHidden } = useDayRender(
              date,
              displayMonth,
              buttonRef,
            );

            const { selected, today, disabled, range_middle } = activeModifiers;

            if (isHidden) {
              return <></>;
            }

            if (!isButton) {
              return (
                <div
                  {...divProps}
                  className={cx('flex items-center justify-center', divProps.className)}
                />
              );
            }

            const {
              children: buttonChildren,
              className: buttonClassName,
              ...buttonPropsRest
            } = buttonProps;

            return (
              <button
                ref={buttonRef}
                {...buttonPropsRest}
                type="button"
                className={cx('relative', buttonClassName)}
              >
                {buttonChildren}
                {today && (
                  <span
                    className={cx(
                      'absolute inset-x-1/2 bottom-1.5 h-0.5 w-4 -translate-x-1/2 rounded-[2px]',
                      {
                        'bg-blue-500 dark:bg-blue-500': !selected,
                        '!bg-white dark:!bg-gray-950': selected,
                        '!bg-gray-400 dark:!bg-gray-600': selected && range_middle,
                        'bg-gray-400 text-gray-400 dark:bg-gray-400 dark:text-gray-600': disabled,
                      },
                    )}
                  />
                )}
              </button>
            );
          },
        }}
        tremor-id="tremor-raw"
        {...(mode === 'single' && (props as SingleProps))}
      />
    );
  },
);

CalendarPrimitive.displayName = 'CalendarPrimitive';

//#region Trigger
// ============================================================================

const triggerStyles = tv({
  base: [
    // base
    'peer flex w-full cursor-pointer appearance-none items-center gap-x-2 truncate rounded-md border px-3 py-2 shadow-sm outline-none transition-all sm:text-sm',
    // background color
    'bg-white dark:bg-gray-950',
    // border color
    'border-gray-300 dark:border-gray-800',
    // text color
    'text-gray-900 dark:text-gray-50',
    // placeholder color
    'placeholder-gray-400 dark:placeholder-gray-500',
    // hover
    'hover:bg-gray-50 hover:dark:bg-gray-950/50',
    // disabled
    'disabled:pointer-events-none',
    'disabled:bg-gray-100 disabled:text-gray-400',
    'disabled:dark:border-gray-800 disabled:dark:bg-gray-800 disabled:dark:text-gray-500',
    // focus
    focusInput,
    // invalid (optional)
    // "aria-[invalid=true]:dark:ring-red-400/20 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-200 aria-[invalid=true]:border-red-500 invalid:ring-2 invalid:ring-red-200 invalid:border-red-500"
  ],
  variants: {
    hasError: {
      true: hasErrorInput,
    },
  },
});

interface TriggerProps extends React.ComponentProps<'button'>, VariantProps<typeof triggerStyles> {
  placeholder?: string;
}

const Trigger = React.memo(
  React.forwardRef<HTMLButtonElement, TriggerProps>(
    ({ className, children, placeholder, hasError, ...props }: TriggerProps, forwardedRef) => {
      return (
        <PopoverPrimitives.Trigger asChild>
          <button
            ref={forwardedRef}
            className={cx(triggerStyles({ hasError }), className, 'flex justify-between px-4')}
            {...props}
          >
            <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-900 dark:text-gray-50">
              {children ? (
                children
              ) : placeholder ? (
                <span className="text-gray-400 dark:text-gray-600">{placeholder}</span>
              ) : null}
            </span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 1C4.77614 1 5 1.22386 5 1.5V2H10V1.5C10 1.22386 10.2239 1 10.5 1C10.7761 1 11 1.22386 11 1.5V2H12.5C13.3284 2 14 2.67157 14 3.5V12.5C14 13.3284 13.3284 14 12.5 14H2.5C1.67157 14 1 13.3284 1 12.5V3.5C1 2.67157 1.67157 2 2.5 2H4V1.5C4 1.22386 4.22386 1 4.5 1ZM10 3V3.5C10 3.77614 10.2239 4 10.5 4C10.7761 4 11 3.77614 11 3.5V3H12.5C12.7761 3 13 3.22386 13 3.5V5H2V3.5C2 3.22386 2.22386 3 2.5 3H4V3.5C4 3.77614 4.22386 4 4.5 4C4.77614 4 5 3.77614 5 3.5V3H10ZM2 6V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V6H2ZM7 7.5C7 7.22386 7.22386 7 7.5 7C7.77614 7 8 7.22386 8 7.5C8 7.77614 7.77614 8 7.5 8C7.22386 8 7 7.77614 7 7.5ZM9.5 7C9.22386 7 9 7.22386 9 7.5C9 7.77614 9.22386 8 9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7ZM11 7.5C11 7.22386 11.2239 7 11.5 7C11.7761 7 12 7.22386 12 7.5C12 7.77614 11.7761 8 11.5 8C11.2239 8 11 7.77614 11 7.5ZM11.5 9C11.2239 9 11 9.22386 11 9.5C11 9.77614 11.2239 10 11.5 10C11.7761 10 12 9.77614 12 9.5C12 9.22386 11.7761 9 11.5 9ZM9 9.5C9 9.22386 9.22386 9 9.5 9C9.77614 9 10 9.22386 10 9.5C10 9.77614 9.77614 10 9.5 10C9.22386 10 9 9.77614 9 9.5ZM7.5 9C7.22386 9 7 9.22386 7 9.5C7 9.77614 7.22386 10 7.5 10C7.77614 10 8 9.77614 8 9.5C8 9.22386 7.77614 9 7.5 9ZM5 9.5C5 9.22386 5.22386 9 5.5 9C5.77614 9 6 9.22386 6 9.5C6 9.77614 5.77614 10 5.5 10C5.22386 10 5 9.77614 5 9.5ZM3.5 9C3.22386 9 3 9.22386 3 9.5C3 9.77614 3.22386 10 3.5 10C3.77614 10 4 9.77614 4 9.5C4 9.22386 3.77614 9 3.5 9ZM3 11.5C3 11.2239 3.22386 11 3.5 11C3.77614 11 4 11.2239 4 11.5C4 11.7761 3.77614 12 3.5 12C3.22386 12 3 11.7761 3 11.5ZM5.5 11C5.22386 11 5 11.2239 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 11.2239 5.77614 11 5.5 11ZM7 11.5C7 11.2239 7.22386 11 7.5 11C7.77614 11 8 11.2239 8 11.5C8 11.7761 7.77614 12 7.5 12C7.22386 12 7 11.7761 7 11.5ZM9.5 11C9.22386 11 9 11.2239 9 11.5C9 11.7761 9.22386 12 9.5 12C9.77614 12 10 11.7761 10 11.5C10 11.2239 9.77614 11 9.5 11Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </PopoverPrimitives.Trigger>
      );
    },
  ),
);

Trigger.displayName = 'DatePicker.Trigger';

//#region Popover
// ============================================================================

const CalendarPopover = React.memo(
  React.forwardRef<
    React.ElementRef<typeof PopoverPrimitives.Content>,
    React.ComponentProps<typeof PopoverPrimitives.Content>
  >(({ align, className, children, ...props }, forwardedRef) => {
    return (
      <PopoverPrimitives.Portal>
        <PopoverPrimitives.Content
          ref={forwardedRef}
          sideOffset={10}
          side="bottom"
          align={align}
          avoidCollisions
          onOpenAutoFocus={(e) => e.preventDefault()}
          className={cx(
            // base
            'relative z-50 w-fit rounded-md border text-sm shadow-xl shadow-black/[2.5%]',
            // widths
            'min-w-[calc(var(--radix-select-trigger-width)-2px)] max-w-[95vw]',
            // border color
            'border-gray-200 dark:border-gray-800',
            // background color
            'bg-white dark:bg-gray-950',
            // transition
            'will-change-[transform,opacity]',
            'data-[state=closed]:animate-hide',
            'data-[state=open]:data-[side=bottom]:animate-slideDownAndFade data-[state=open]:data-[side=left]:animate-slideLeftAndFade data-[state=open]:data-[side=right]:animate-slideRightAndFade data-[state=open]:data-[side=top]:animate-slideUpAndFade',
            className,
          )}
          {...props}
        >
          {children}
        </PopoverPrimitives.Content>
      </PopoverPrimitives.Portal>
    );
  }),
);

CalendarPopover.displayName = 'DatePicker.CalendarPopover';

//#region Date Picker Shared
// ============================================================================

const formatDate = (date: Date, locale: Locale): string => {
  const dateString: string = format(date, 'dd MMM, yyyy', { locale });

  return dateString;
};

type CalendarPickerProps = {
  fromYear?: number;
  toYear?: number;
  fromMonth?: Date;
  toMonth?: Date;
  fromDay?: Date;
  toDay?: Date;
  fromDate?: Date;
  toDate?: Date;
  locale?: Locale;
};

type Translations = {
  cancel?: string;
  apply?: string;
  start?: string;
  end?: string;
  range?: string;
};

interface PickerProps extends CalendarPickerProps {
  className?: string;
  disabled?: boolean;
  disabledDays?: Matcher | Matcher[] | undefined;
  required?: boolean;
  showTimePicker?: boolean;
  placeholder?: string;
  enableYearNavigation?: boolean;
  disableNavigation?: boolean;
  hasError?: boolean;
  id?: string;
  // Customize the date picker for different languages.
  translations?: Translations;
  align?: 'center' | 'end' | 'start';
  'aria-invalid'?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-required'?: boolean;
}

//#region Single Date Picker
// ============================================================================

interface SinglePickerProps extends Omit<PickerProps, 'translations'> {
  defaultValue?: Date;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  translations?: Omit<Translations, 'range'>;
}

const SingleDatePicker = ({
  defaultValue,
  value,
  onChange,
  disabled,
  disabledDays,
  disableNavigation,
  className,
  showTimePicker,
  placeholder = 'Select date',
  hasError,
  translations,
  locale = enUS,
  align = 'center',
  ...props
}: SinglePickerProps) => {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value ?? defaultValue ?? undefined);
  const [month, setMonth] = React.useState<Date | undefined>(date);

  React.useEffect(() => {
    setDate(value ?? defaultValue ?? undefined);
  }, [value, defaultValue]);

  React.useEffect(() => {
    if (date) {
      setMonth(date);
    }
  }, [date]);

  React.useEffect(() => {
    if (!open) {
      setMonth(date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onCancel = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        onCancel();
      }
      setOpen(open);
    },
    [onCancel],
  );

  const onDateChange = React.useCallback((newDate: Date | undefined) => {
    setDate(newDate);
  }, []);

  const formattedDate = React.useMemo(() => {
    if (!date) {
      return null;
    }
    return formatDate(date, locale);
  }, [date, locale]);

  const onApply = React.useCallback(() => {
    setOpen(false);
    onChange?.(date);
  }, [onChange, date]);

  React.useEffect(() => {
    setDate(value ?? defaultValue ?? undefined);
  }, [value, defaultValue]);

  return (
    <PopoverPrimitives.Root tremor-id="tremor-raw" open={open} onOpenChange={onOpenChange}>
      <Trigger
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        hasError={hasError}
        aria-required={props.required || props['aria-required']}
        aria-invalid={props['aria-invalid']}
        aria-label={props['aria-label']}
        aria-labelledby={props['aria-labelledby']}
      >
        {formattedDate}
      </Trigger>
      <CalendarPopover align={align}>
        <div className="flex">
          <div className="flex flex-col sm:flex-row sm:items-start">
            <div>
              <CalendarPrimitive
                mode="single"
                month={month}
                onMonthChange={setMonth}
                selected={date}
                onSelect={onDateChange}
                disabled={disabledDays}
                locale={locale}
                disableNavigation={disableNavigation}
                initialFocus
                {...(props as SingleProps)}
              />
              <div className="flex items-center gap-x-2 border-t border-gray-200 p-3 dark:border-gray-800">
                <Button variant="outline" className="h-8 w-full" type="button" onClick={onCancel}>
                  {translations?.cancel ?? 'Cancel'}
                </Button>
                <Button className="h-8 w-full" type="button" disabled={!date} onClick={onApply}>
                  {translations?.apply ?? 'Apply'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CalendarPopover>
    </PopoverPrimitives.Root>
  );
};

//#region Types & Exports
// ============================================================================

type SingleDatePickerProps = {
  defaultValue?: Date;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
} & PickerProps;

export const DatePicker = React.memo(({ ...props }: SingleDatePickerProps) => {
  return <SingleDatePicker {...(props as SinglePickerProps)} />;
});

DatePicker.displayName = 'DatePicker';
