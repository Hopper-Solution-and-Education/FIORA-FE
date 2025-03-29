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
  name: string; // Required for form handling
  value?: string; // Selected value
  onChange?: (value: string) => void; // Callback for value changes
  onBlur?: () => void; // Optional blur handler
  options: { value: string; label: string; icon?: string }[]; // Select options
  placeholder?: string; // Placeholder text
  error?: FieldError; // Form error from react-hook-form
  label?: React.ReactNode | string; // Label content (string or custom node)
  required?: boolean; // Whether the field is required
  disabled?: boolean; // Disable the select
  id?: string; // HTML id for accessibility
  [key: string]: any; // Rest props for additional attributes
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  value = '',
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
