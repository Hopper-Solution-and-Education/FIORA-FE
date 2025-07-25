'use client';

import GlobalLabel from '@/components/common/atoms/GlobalLabel';
import { cn } from '@/shared/utils';
import React, { memo } from 'react';
import { FieldError } from 'react-hook-form';

interface StarRatingFieldProps {
  name: string;
  value?: number;
  onChange?: (value: number) => void;
  onBlur?: () => void;
  error?: FieldError;
  label?: React.ReactNode | string;
  required?: boolean;
  id?: string;
  maxStars?: number;
  className?: string;
  starClassName?: string;
  [key: string]: any;
}

const StarRatingField: React.FC<StarRatingFieldProps> = ({
  name,
  value = 0,
  onChange = () => {},
  onBlur,
  error,
  label,
  required = false,
  id = name,
  maxStars = 5,
  className,
  starClassName = 'w-6 h-6 text-yellow-400 cursor-pointer',
}) => {
  return (
    <div className={cn('space-y-2 mb-4', className)}>
      {label &&
        (typeof label === 'string' ? (
          <GlobalLabel text={label} required={required} htmlFor={id} />
        ) : (
          label
        ))}
      <div id={id} className="flex items-center space-x-1" onBlur={onBlur}>
        {Array.from({ length: maxStars }).map((_, idx) => {
          const starValue = idx + 1;
          return (
            <svg
              key={starValue}
              onClick={() => onChange(starValue)}
              className={cn(
                starClassName,
                starValue <= value ? 'fill-yellow-400' : 'fill-gray-300',
              )}
              viewBox="0 0 20 20"
              fill="currentColor"
              tabIndex={0}
              aria-label={`${starValue} star`}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onChange(starValue);
              }}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" />
            </svg>
          );
        })}
      </div>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export default memo(StarRatingField);
