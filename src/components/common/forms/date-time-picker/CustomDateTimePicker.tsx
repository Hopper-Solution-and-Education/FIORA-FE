'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/shared/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';
import type { DropdownNavProps, DropdownProps } from 'react-day-picker';
import { useFormContext } from 'react-hook-form';
import GlobalLabel from '../../atoms/GlobalLabel';

interface CustomDateTimePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  showYearDropdown?: boolean;
  showMonthDropdown?: boolean;
  dropdownMode?: string;
  dateFormat?: string;
  className?: string;
  error?: any;
}

const CustomDateTimePicker = forwardRef<HTMLInputElement, CustomDateTimePickerProps>(
  (
    {
      name,
      label,
      placeholder = 'Select date',
      required = false,
      dateFormat = 'dd/MM/yyyy',
      className,
      error,
    },
    ref,
  ) => {
    const { register, setValue, watch } = useFormContext();
    const selectedDate = watch(name); // Giá trị từ form, mong đợi là ISO string
    const [date, setDate] = useState<Date | undefined>(
      selectedDate ? new Date(selectedDate) : undefined,
    );

    const handleCalendarChange = (
      _value: string | number,
      _e: React.ChangeEventHandler<HTMLSelectElement>,
    ) => {
      const _event = {
        target: {
          value: String(_value),
        },
      } as React.ChangeEvent<HTMLSelectElement>;
      _e(_event);
    };

    const handleSelect = (date: Date | undefined) => {
      setDate(date);
      if (date) {
        const isoDate = date.toISOString();
        setValue(name, isoDate, { shouldValidate: true, shouldDirty: true });
      } else {
        setValue(name, null, { shouldValidate: true, shouldDirty: true });
      }
    };

    return (
      <div className="space-y-2">
        {label && <GlobalLabel text={label} required={required} htmlFor={name} />}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
                className,
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, dateFormat) : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelect}
              className="rounded-md border p-2"
              classNames={{
                month_caption: 'mx-0',
                day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/10 hover:text-primary rounded-md transition-colors',
                day_selected:
                  'bg-primary text-primary-foreground font-bold ring-2 ring-primary ring-offset-1 focus:outline-none focus:ring-2 focus:ring-primary',
                day_today: 'bg-accent text-accent-foreground ring-1 ring-accent',
              }}
              captionLayout="dropdown"
              defaultMonth={date || new Date()}
              initialFocus
              startMonth={new Date(1980, 6)}
              hideNavigation
              components={{
                DropdownNav: (props: DropdownNavProps) => {
                  return <div className="flex w-full items-center gap-2">{props.children}</div>;
                },
                Dropdown: (props: DropdownProps) => {
                  return (
                    <Select
                      value={String(props.value)}
                      onValueChange={(value) => {
                        if (props.onChange) {
                          handleCalendarChange(value, props.onChange);
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 w-fit font-medium first:grow">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                        {props.options?.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={String(option.value)}
                            disabled={option.disabled}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                },
              }}
            />
          </PopoverContent>
        </Popover>
        <input type="hidden" {...register(name)} ref={ref} />
        {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
      </div>
    );
  },
);

CustomDateTimePicker.displayName = 'CustomDateTimePicker';

export default CustomDateTimePicker;
