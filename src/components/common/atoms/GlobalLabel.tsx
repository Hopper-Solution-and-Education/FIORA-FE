'use client';

import { cn } from '@/shared/utils';
import React from 'react';

export interface GlobalLabelProps {
  text?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function GlobalLabel({
  text,
  required = false,
  htmlFor,
  className,
  children,
}: GlobalLabelProps): React.ReactNode {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'block text-sm font-medium mb-1',
        'text-gray-900 dark:text-gray-300',
        className,
      )}
    >
      {children ? (
        children
      ) : (
        <span className="flex items-center gap-1">
          {text}
          {required && (
            <span className="text-red-500 dark:text-red-400" aria-hidden="true">
              *
            </span>
          )}
        </span>
      )}
    </label>
  );
}
