'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/shared/utils';
import React, { memo } from 'react';
import { FieldError } from 'react-hook-form';

interface SliderFieldProps {
  name: string;
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  required?: boolean;
  id?: string;
  className?: string;
  [key: string]: any;
}

const SliderField: React.FC<SliderFieldProps> = ({
  name,
  value = 0,
  onChange = () => {},
  onBlur,
  error,
  label,
  required = false,
  id = name,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2 mb-4">
      {label &&
        (typeof label === 'string' ? (
          <GlobalLabel text={label} required={required} htmlFor={id} />
        ) : (
          label
        ))}
      <Slider
        value={[value]}
        onValueChange={(value) => onChange(value[0])}
        onBlur={onBlur}
        id={id}
        name={name}
        className={cn(error ? 'border-red-500' : '', className)}
        data-test={props['data-test'] || (name ? `${name}-slider` : undefined)}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default memo(SliderField);
