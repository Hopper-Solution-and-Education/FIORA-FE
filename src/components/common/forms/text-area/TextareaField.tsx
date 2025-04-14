'use client';

import React, { memo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FieldError } from 'react-hook-form';
import GlobalLabel from '@/components/common/atoms/GlobalLabel';

interface TextareaFieldProps {
  name: string; // Required for form handling
  value?: string; // Textarea value
  onChange?: (value: string) => void; // Callback for value changes
  onBlur?: () => void; // Optional blur handler
  error?: FieldError; // Form error from react-hook-form
  label?: React.ReactNode | string; // Label content (string or custom node)
  required?: boolean; // Whether the field is required
  placeholder?: string; // Placeholder text
  id?: string; // HTML id for accessibility
  [key: string]: any; // Rest props for additional attributes
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  name,
  value = '',
  onChange = () => {},
  onBlur,
  error,
  label,
  required = false,
  placeholder,
  id = name, // Default to name if no id provided
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label &&
        (typeof label === 'string' ? (
          <GlobalLabel text={label} required={required} htmlFor={id} />
        ) : (
          label
        ))}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        id={id}
        name={name}
        className={error ? 'border-red-500' : ''}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default memo(TextareaField);
