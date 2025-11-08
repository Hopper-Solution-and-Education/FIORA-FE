'use client';

import { cn } from '@/shared/utils';
import React from 'react';

const Page = ({ children, className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn('flex flex-col flex-1 space-y-8 sm:p-4 md:p-8 lg:p-16', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Page;
