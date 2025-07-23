'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/shared/utils';
import React, { memo } from 'react';
import { FieldError } from 'react-hook-form';

interface SwitchFieldProps {
  name: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  required?: boolean;
  id?: string;
  className?: string;
  activeLabel?: string;
  inactiveLabel?: string;
  [key: string]: any;
}

const SwitchField: React.FC<SwitchFieldProps> = ({
  name,
  value = false,
  onChange = () => {},
  onBlur,
  error,
  label,
  required = false,
  id = name,
  className,
  activeLabel = 'On',
  inactiveLabel = 'Off',
  ...props
}) => {
  return (
    <div className={cn('space-y-2 mb-4', className)}>
      {label &&
        (typeof label === 'string' ? (
          <GlobalLabel text={label} required={required} htmlFor={id} />
        ) : (
          label
        ))}
      <div className="flex items-center gap-3">
        <Switch
          id={id}
          name={name}
          checked={!!value}
          onCheckedChange={onChange}
          onBlur={onBlur}
          {...props}
        />
        <span className="text-sm font-medium text-gray-700 select-none">
          {value ? activeLabel : inactiveLabel}
        </span>
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default memo(SwitchField);
