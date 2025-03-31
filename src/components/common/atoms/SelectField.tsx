'use client';

import React from 'react';
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

interface SelectFieldProps {
  name: string;
  value?: string;
  defaultValue?: string; // Add this line
  onChange?: (value: string) => void;
  onBlur?: () => void;
  options: { value: string; label: string; icon?: string }[];
  placeholder?: string;
  error?: FieldError;
  label?: React.ReactNode | string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  [key: string]: any;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  value = '',
  defaultValue,
  onChange = () => {},
  onBlur,
  options,
  placeholder,
  error,
  label,
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
      defaultValue={defaultValue} // Add this line
      onValueChange={onChange}
      onOpenChange={(open) => !open && onBlur?.()}
      disabled={disabled}
      name={name}
      {...props}
    >
      <SelectTrigger id={id} className={error ? 'border-red-500' : ''}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
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

export default SelectField;
