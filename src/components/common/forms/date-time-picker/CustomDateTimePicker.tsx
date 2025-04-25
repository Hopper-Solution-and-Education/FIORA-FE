'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { CalendarIcon, ChevronLeft, ChevronRight, ClockIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import GlobalLabel from '../../atoms/GlobalLabel';

interface CustomDateTimePickerProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  dateFormat?: string;
  className?: string;
  error?: any;
  containTimePicker?: boolean;
  showYearDropdown?: boolean; // remove later
  showMonthDropdown?: boolean; // remove later
  dropdownMode?: string; // remove later
  yearOnly?: boolean; // Enable year-only mode
  disabled?: boolean;
}

const CustomDateTimePicker = forwardRef<HTMLInputElement, CustomDateTimePickerProps>(
  (
    {
      name,
      label,
      placeholder = 'Select date',
      required = false,
      dateFormat = 'dd/MM/yyyy HH:mm:ss',
      className,
      error,
      containTimePicker = false,
      yearOnly = false,
      disabled = false,
    },
    ref,
  ) => {
    const { register, setValue, watch } = useFormContext();
    const selectedDate = watch(name); // Expected to be ISO string
    const [date, setDate] = useState<Date | undefined>(
      selectedDate ? new Date(selectedDate) : undefined,
    );
    const [open, setOpen] = useState(false);

    const [yearRange, setYearRange] = useState({
      start: Math.floor((date?.getFullYear() || new Date().getFullYear()) / 12) * 12,
    });

    const handleSelect = (newDate: Date | undefined) => {
      setDate(newDate);
      if (newDate) {
        if (yearOnly) {
          setValue(name, newDate.getFullYear().toString(), {
            shouldValidate: true,
            shouldDirty: true,
          });
        } else {
          const isoDate = newDate.toISOString();
          setValue(name, isoDate, { shouldValidate: true, shouldDirty: true });
        }
      } else {
        setValue(name, null, { shouldValidate: true, shouldDirty: true });
      }
    };

    const handleYearSelect = (year: number) => {
      setOpen(false);
      const newDate = new Date(date || new Date());
      newDate.setFullYear(year);
      newDate.setMonth(0); // Default to January
      newDate.setDate(1); // Default to 1st
      newDate.setHours(0, 0, 0, 0); // Reset time
      setDate(newDate);

      if (yearOnly) {
        setValue(name, year.toString(), { shouldValidate: true, shouldDirty: true });
      } else {
        handleSelect(newDate);
      }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedDate) return;

      const [hours, minutes, seconds] = e.target.value.split(':').map(Number);
      const updatedDate = new Date(selectedDate);
      updatedDate.setHours(hours || 0);
      updatedDate.setMinutes(minutes || 0);
      updatedDate.setSeconds(seconds || 0);

      setDate(updatedDate);
      setValue(name, updatedDate.toISOString(), { shouldValidate: true, shouldDirty: true });
    };

    // Generate years for the current range (12 years, 3x4 grid)
    const years = Array.from({ length: 12 }, (_, i) => yearRange.start + i);

    return (
      <div className="space-y-2 mb-4">
        {label && <GlobalLabel text={label} required={required} htmlFor={name} />}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              disabled={disabled}
              variant="outline"
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
                className,
                error && required ? 'border-red-500' : '',
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? (
                yearOnly ? (
                  date.getFullYear()
                ) : (
                  format(date, dateFormat)
                )
              ) : (
                <span>{placeholder}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {yearOnly ? (
              // Year-only picker styled like Shadcn/UI Calendar
              <div className="rounded-md border p-2">
                <div className="flex items-center justify-between p-2">
                  <Button
                    variant="outline"
                    type="button"
                    size="icon"
                    onClick={() => setYearRange({ start: yearRange.start - 12 })}
                    className="h-7 w-7"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">
                    {yearRange.start}–{yearRange.start + 11}
                  </span>
                  <Button
                    variant="outline"
                    type="button"
                    size="icon"
                    onClick={() => setYearRange({ start: yearRange.start + 12 })}
                    className="h-7 w-7"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-4 gap-2 p-2">
                  {years.map((year) => (
                    <Button
                      type="button"
                      key={year}
                      variant={date?.getFullYear() === year ? 'default' : 'ghost'}
                      className={cn(
                        'h-9 w-16 text-sm',
                        date?.getFullYear() === year
                          ? 'bg-primary text-primary-foreground font-bold'
                          : 'hover:bg-primary/10 hover:text-primary',
                        new Date().getFullYear() === year && 'ring-1 ring-accent',
                      )}
                      onClick={() => handleYearSelect(year)}
                    >
                      {year}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              // Default calendar picker
              <Calendar
                disabled={disabled}
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
                  DropdownNav: ({ children }) => (
                    <div className="flex w-full items-center gap-2">{children}</div>
                  ),
                  Dropdown: ({ value, onChange, options }) => (
                    <Select
                      disabled={disabled}
                      value={String(value)}
                      onValueChange={(newValue) => {
                        if (onChange) {
                          const event = {
                            target: { value: newValue },
                          } as React.ChangeEvent<HTMLSelectElement>;
                          onChange(event);
                        }
                      }}
                    >
                      <SelectTrigger className="h-8 w-fit font-medium first:grow">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[min(26rem,var(--radix-select-content-available-height))]">
                        {options?.map((option) => (
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
                  ),
                }}
              />
            )}
            {containTimePicker && !yearOnly && (
              <div className="border-t py-2 px-3">
                <div className="flex items-center gap-3">
                  <Label className="text-xs">Enter time</Label>
                  <div className="relative grow">
                    <Input
                      disabled={disabled}
                      type="time"
                      step="1"
                      defaultValue={format(date || new Date(), 'HH:mm:ss')}
                      onChange={handleTimeChange}
                      className="peer appearance-none ps-9 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    />
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                      <ClockIcon size={16} aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </div>
            )}
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
