'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { Label } from '@/components/ui/label';
import { RadioGroupItem } from '@/components/ui/radio-group';
import LucieIcon from '@/features/home/module/category/components/LucieIcon';
import { cn, isImageUrl } from '@/shared/utils';
import { RadioGroup } from '@radix-ui/react-radio-group';
import Image from 'next/image';
import React, { memo } from 'react';
import { FieldError } from 'react-hook-form';

export interface RadioOption {
  value: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  description?: string;
  // Customization for individual option container
  className?: string;
  // Control relative width when orientation is horizontal. If provided, we set flexGrow inline.
  // Example: 2 means this option is twice as wide as an option with flex=1
  flex?: number;
}

interface RadioFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  id?: string;
  name?: string;
  required?: boolean;
  options?: RadioOption[];
  disabled?: boolean;
  className?: string;
  orientation?: 'vertical' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  // Visual style of each option
  variant?: 'default' | 'card';
  // When horizontal, make all options take equal width (flex: 1). Can still be overridden by option.flex
  equalWidth?: boolean;
  [key: string]: any;
}

const RadioField: React.FC<RadioFieldProps> = ({
  value = '',
  onChange = () => {},
  onBlur,
  error,
  label,
  id,
  name,
  required,
  options = [],
  disabled,
  className,
  orientation = 'vertical',
  size = 'md',
  variant = 'default',
  equalWidth = false,
  ...props
}) => {
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

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'gap-2',
          radio: 'w-3 h-3',
          label: 'text-sm',
          description: 'text-xs',
        };
      case 'lg':
        return {
          container: 'gap-4',
          radio: 'w-5 h-5',
          label: 'text-lg',
          description: 'text-sm',
        };
      default:
        return {
          container: 'gap-3',
          radio: 'w-4 h-4',
          label: 'text-base',
          description: 'text-sm',
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={cn('mb-4', className)}>
      {label &&
        (typeof label === 'string' ? (
          <GlobalLabel className="mb-2" text={label} htmlFor={id} required={required} />
        ) : (
          label
        ))}
      <RadioGroup
        value={value}
        onValueChange={(newValue: string) => {
          onChange(newValue);
          onBlur?.();
        }}
        disabled={disabled}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col',
          sizeClasses.container,
        )}
        aria-labelledby={label ? id : undefined}
        aria-required={required}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      >
        {options.map((option) => {
          const optionId = `${name || id}-${option.value}`;
          const isSelected = value === option.value;

          return (
            <div
              key={option.value}
              className={cn(
                'flex items-start space-x-2',
                orientation === 'horizontal' ? 'mr-6 mb-2' : 'mb-2',
                (disabled || option.disabled) && 'opacity-50 cursor-not-allowed',
                variant === 'card' &&
                  'rounded-lg border bg-background px-4 py-3 transition-colors hover:bg-accent data-[state=checked]:bg-accent/40',
                option.className,
              )}
              style={{
                flexGrow:
                  orientation === 'horizontal'
                    ? (option.flex ?? (equalWidth ? 1 : undefined))
                    : undefined,
              }}
            >
              <RadioGroupItem
                value={option.value}
                id={optionId}
                disabled={disabled || option.disabled}
                className={cn('mt-0.5', sizeClasses.radio, error && 'border-red-500')}
                data-test={props['data-test'] ? `${props['data-test']}-${option.value}` : undefined}
              />
              <Label
                htmlFor={optionId}
                className={cn(
                  'cursor-pointer flex-1',
                  sizeClasses.label,
                  (disabled || option.disabled) && 'cursor-not-allowed',
                  error && 'text-red-600',
                )}
              >
                <div
                  className={cn('flex items-center gap-2', variant === 'card' && 'font-semibold')}
                >
                  {option.icon && renderIconOrImage(option.icon)}
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                {option.description && (
                  <p className={cn('text-gray-600 mt-1', sizeClasses.description)}>
                    {option.description}
                  </p>
                )}
              </Label>
            </div>
          );
        })}
      </RadioGroup>

      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default memo(RadioField);
