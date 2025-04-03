'use client';

import { cn } from '@/shared/utils';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Check, ChevronDown, X } from 'lucide-react';
import * as React from 'react';

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    { options, selected, onChange, placeholder = 'Select options', className, disabled = false },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);

    const handleSelect = (value: string) => {
      onChange(
        selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value],
      );
    };

    const handleRemoveOption = (e: React.MouseEvent, value: string) => {
      e.stopPropagation();
      onChange(selected.filter((item) => item !== value));
    };

    return (
      <div className="space-y-2">
        <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
          <PopoverPrimitive.Trigger
            ref={ref}
            className={cn(
              'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 overflow-hidden">
              {selected.length > 0 ? (
                <span className="text-sm">
                  {selected.length} option{selected.length !== 1 ? 's' : ''} selected
                </span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </PopoverPrimitive.Trigger>
          <PopoverPrimitive.Content
            className={cn(
              'relative z-50 max-h-96 min-w-[8rem] overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md',
              'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
              'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
              'w-[var(--radix-popover-trigger-width)]',
              'max-h-[25vh] overflow-y-scroll no-scrollbar',
            )}
            align="start"
          >
            <div className="p-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-md outline-none hover:bg-accent hover:text-accent-foreground',
                    option.disabled && 'pointer-events-none opacity-50',
                    selected.includes(option.value) && 'bg-accent text-accent-foreground',
                  )}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                  <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    {selected.includes(option.value) && <Check className="h-4 w-4" />}
                  </span>
                  {option.label}
                </div>
              ))}
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Root>

        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selected.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <span
                  key={value}
                  className="inline-flex items-center gap-1 rounded-sm bg-secondary px-1.5 py-0.5 text-xs"
                >
                  {option?.label || value}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={(e) => handleRemoveOption(e, value)}
                  />
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);
MultiSelect.displayName = 'MultiSelect';

export { MultiSelect };
