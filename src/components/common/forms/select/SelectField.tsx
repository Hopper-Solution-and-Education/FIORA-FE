'use client';

import React, { memo } from 'react';
import { FieldError } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import LucieIcon from '@/features/home/module/category/components/LucieIcon';
import { cn } from '@/shared/utils';

export interface Option {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}
interface SelectFieldProps {
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  options: Array<Option>;
  placeholder?: string;
  error?: FieldError;
  label?: React.ReactNode | string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  [key: string]: any;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  value,
  defaultValue,
  onChange = () => {},
  onBlur,
  options,
  placeholder,
  error,
  label,
  className,
  required = false,
  disabled = false,
  id = name,
  ...props
}) => (
  <div className="space-y-2">
    {label &&
      (typeof label === 'string' ? (
        <GlobalLabel text={label} required={required} htmlFor={id} />
      ) : (
        label
      ))}
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onChange}
      onOpenChange={(open) => !open && onBlur?.()}
      disabled={disabled}
      name={name}
      {...props}
    >
      <SelectTrigger id={id} className={cn(error ? 'border-red-500' : '', className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[30vh] overflow-y-scroll no-scrollbar">
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
              <div
                className={cn(
                  'flex items-center gap-2',
                  option.disabled && 'text-muted-foreground',
                )}
              >
                {option.icon && <LucieIcon icon={option.icon} className="w-4 h-4" />}
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
    {error && <p className="text-sm text-red-500">{error.message}</p>}
  </div>
);

export default memo(SelectField);
