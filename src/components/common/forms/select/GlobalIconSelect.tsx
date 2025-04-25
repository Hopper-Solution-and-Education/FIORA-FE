'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import IconSelect from '@/components/common/forms/select/IconSelect';
import React from 'react';
import { FieldError } from 'react-hook-form';

interface GlobalIconSelectProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  required?: boolean;
  id?: string;
  disabled?: boolean;
  [key: string]: any;
}

const GlobalIconSelect: React.FC<GlobalIconSelectProps> = ({
  name,
  value = '',
  onChange = () => {},
  error,
  label,
  required = false,
  id = name,
  disabled = false,
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
      <IconSelect
        selectedIcon={value}
        onIconChange={onChange}
        className={error ? 'border-red-500' : ''}
        disabled={disabled}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default GlobalIconSelect;
