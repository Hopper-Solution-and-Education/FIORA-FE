'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import IconSelect from '@/components/common/atoms/IconSelect';
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
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default GlobalIconSelect;
