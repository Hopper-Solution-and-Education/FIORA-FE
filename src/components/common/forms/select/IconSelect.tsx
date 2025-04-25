'use client';

import { Icons } from '@/components/Icon';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { iconOptions } from '@/shared/constants/data';
import { cn, useGetIconLabel } from '@/shared/utils';
import { Check } from 'lucide-react';
import React, { memo, useEffect, useRef, useState } from 'react';

interface ListIconProps {
  icon: string;
}

const ListIcon: React.FC<ListIconProps> = ({ icon }) => {
  const Icon = Icons[icon as keyof typeof Icons] || Icons['circle'];
  const iconLabel = useGetIconLabel(icon);
  return (
    <div className="flex items-center gap-2">
      {Icon ? <Icon className="w-4 h-4" /> : <span>No Icon</span>}
      <span>{iconLabel || icon}</span>
    </div>
  );
};

interface IconSelectProps {
  selectedIcon: string;
  onIconChange: (value: string) => void;
  className?: string;
  props?: React.HTMLAttributes<HTMLDivElement>;
  required?: boolean;
  label?: string;
  isCheckError?: boolean;
  disabled?: boolean;
}

const IconSelect: React.FC<IconSelectProps> = ({
  selectedIcon,
  onIconChange,
  className,
  props,
  required = false,
  label,
  isCheckError = true,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus CommandInput when Popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className={cn('mb-4', className)} {...props}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-300">
          <span className="flex items-center gap-1">
            {label}
            {required && (
              <span className="text-red-500 dark:text-red-400" aria-hidden="true">
                *
              </span>
            )}
          </span>
        </label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              isCheckError && required && !selectedIcon ? 'border-red-500' : '',
            )}
            onClick={() => setOpen((prev) => !prev)}
          >
            <span
              className={cn(
                'flex items-center gap-2 font-normal',
                !selectedIcon && 'text-muted-foreground',
              )}
            >
              {selectedIcon ? <ListIcon icon={selectedIcon} /> : 'Select an icon...'}
            </span>
            <Icons.chevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[--radix-popover-trigger-width] z-[1000]"
          side="bottom"
          sideOffset={5}
          avoidCollisions
        >
          <Command>
            <CommandInput ref={inputRef} placeholder="Search icons..." className="h-9" />
            <CommandList className="max-h-[240px] overflow-y-auto">
              <CommandEmpty>No icons found.</CommandEmpty>
              {iconOptions.map((data) => (
                <CommandGroup key={data.label} heading={data.label}>
                  {data.options.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={`${item.label} ${item.value}`}
                      onSelect={() => {
                        onIconChange(item.value);
                        setOpen(false);
                      }}
                      className="data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {item.icon ? <item.icon className="w-4 h-4" /> : <span>No Icon</span>}
                        <span>{item.label}</span>
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            selectedIcon === item.value ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default memo(IconSelect);
