'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
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
import LucieIcon from '@/features/home/module/category/components/LucieIcon';
import { cn, isImageUrl } from '@/shared/utils';
import { Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import React, { memo, useEffect, useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';

export interface Option {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

interface SelectFieldProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  placeholder?: string;
  id?: string;
  required?: boolean;
  options?: Option[];
  disabled?: boolean;
  isLoading?: boolean;
  loadOptions?: () => Promise<Option[]>;
  customRenderEmpty?: React.ReactNode;
  onCustomAction?: () => void;
  customActionLabel?: string;
  className?: string;
  noneValue?: boolean;
  [key: string]: any;
}

const SelectField: React.FC<SelectFieldProps> = ({
  side,
  value = '',
  onChange = () => {},
  onBlur,
  error,
  label,
  placeholder = 'Select an option...',
  id,
  required,
  options = [],
  disabled,
  isLoading = false,
  loadOptions,
  customRenderEmpty,
  onCustomAction,
  customActionLabel,
  className,
  noneValue = true,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [internalOptions, setInternalOptions] = useState<Option[]>([...options]);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedOption = internalOptions.find((opt) => opt.value === value);
  const selectedLabel = value && selectedOption ? selectedOption.label : null;
  const selectedIcon = value && selectedOption ? selectedOption.icon : null;

  useEffect(() => {
    if (loadOptions) {
      loadOptions().then((data) => {
        setInternalOptions(noneValue ? [{ value: '', label: 'None' }, ...data] : data);
      });
    } else {
      setInternalOptions(noneValue ? [{ value: '', label: 'None' }, ...options] : options);
    }
  }, [loadOptions, options, noneValue]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const renderIconOrImage = (iconValue?: string) => {
    if (!iconValue) {
      return <></>;
    }

    if (isImageUrl(iconValue)) {
      return (
        <div className="w-5 h-5 rounded-full overflow-hidden">
          <Image
            src={iconValue}
            alt="logo"
            width={20}
            height={20}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add(
                'flex',
                'items-center',
                'justify-center',
                'bg-gray-100',
              );
              const fallbackIcon = document.createElement('div');
              fallbackIcon.innerHTML =
                '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-gray-400"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>';
              e.currentTarget.parentElement?.appendChild(fallbackIcon.firstChild as Node);
            }}
          />
        </div>
      );
    }

    return <LucieIcon icon={iconValue} className="w-4 h-4" />;
  };

  return (
    <div className={cn('mb-4', className)}>
      {label &&
        (typeof label === 'string' ? (
          <GlobalLabel text={label} htmlFor={id} required={required} />
        ) : (
          label
        ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-full justify-between',
              error && 'border-red-500',
              disabled && 'opacity-50 pointer-events-none',
            )}
            id={id}
            onClick={() => setOpen((prev) => !prev)}
            {...props}
          >
            <span
              className={cn(
                'flex items-center gap-2 font-normal',
                !selectedLabel && 'text-muted-foreground',
              )}
            >
              {selectedIcon && renderIconOrImage(selectedIcon)}
              {selectedLabel || placeholder}
            </span>
            <Icons.chevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          side={side || 'bottom'}
          sideOffset={5}
          avoidCollisions={true}
          collisionPadding={10}
          className="p-0 w-[--radix-popover-trigger-width] z-[9999] overflow-visible"
        >
          <Command>
            <CommandInput ref={inputRef} placeholder="Search..." className="h-9" />
            <CommandList className="max-h-[240px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                </div>
              ) : internalOptions.length === 0 ? (
                customRenderEmpty || <CommandEmpty>No option found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {internalOptions.map((option) => (
                    <CommandItem
                      key={option.value || 'none'}
                      value={`${option.label} ${option.value}`}
                      onSelect={() => {
                        onChange(option.value);
                        setOpen(false);
                        onBlur?.();
                      }}
                      disabled={option.disabled}
                      className="data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50"
                    >
                      <div className="flex items-center gap-2 w-full">
                        {renderIconOrImage(option.icon)}
                        {option.label}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            value === option.value ? 'opacity-100' : 'opacity-0',
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              {onCustomAction && (
                <Button
                  className="w-full flex justify-center items-center"
                  type="button"
                  variant="ghost"
                  onClick={onCustomAction}
                >
                  <Icons.add />
                  {customActionLabel ?? 'Add New'}
                </Button>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default memo(SelectField);
