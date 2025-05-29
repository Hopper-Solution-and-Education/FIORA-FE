'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Icons } from '@/components/Icon';
import { cn } from '@/shared/utils';
import { Loader2 } from 'lucide-react';
import React, { memo, useEffect, useState } from 'react';
import { FieldError } from 'react-hook-form';
import { CustomMultiSelect } from '../../atoms';

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

interface MultiSelectFieldProps {
  side?: 'top' | 'bottom' | 'left' | 'right';
  value?: string[];
  onChange?: (value: string[]) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  placeholder?: string;
  searchPlaceholder?: string;
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
  [key: string]: any;
}

const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  value = [],
  onChange = () => {},
  onBlur,
  error,
  label,
  placeholder = 'Select options...',
  searchPlaceholder = 'Search...',
  id,
  required,
  options = [],
  disabled,
  isLoading = false,
  loadOptions,
  onCustomAction,
  customActionLabel,
  className,
  ...props
}) => {
  const [internalOptions, setInternalOptions] = useState<Option[]>(options);

  // Auto-load options if loadOptions is provided
  useEffect(() => {
    if (loadOptions) {
      loadOptions().then((data) => {
        setInternalOptions(data);
      });
    } else {
      setInternalOptions(options);
    }
  }, [loadOptions, options]);

  return (
    <div className={cn(className)}>
      {label &&
        (typeof label === 'string' ? (
          <GlobalLabel text={label} htmlFor={id} required={required} />
        ) : (
          label
        ))}
      <div className="relative">
        <CustomMultiSelect
          onBlur={onBlur}
          options={internalOptions}
          selected={value}
          onChange={onChange}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          disabled={disabled}
          className={cn(
            'h-9',
            error && 'border-red-500',
            disabled && 'opacity-50 pointer-events-none',
          )}
          {...props}
        />
        {isLoading && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2">
            <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
      {onCustomAction && (
        <button
          type="button"
          className="mt-2 text-sm text-primary hover:text-primary/80 flex items-center gap-1"
          onClick={onCustomAction}
        >
          <Icons.add className="w-4 h-4" />
          {customActionLabel ?? 'Add New'}
        </button>
      )}
    </div>
  );
};

export default memo(MultiSelectField);
