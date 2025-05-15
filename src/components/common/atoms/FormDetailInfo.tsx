'use client';

// Remove Avatar imports
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { formatDateTime } from '@/shared/lib';
import { CreatedBy, UpdatedBy } from '@/shared/types';
import { cn } from '@/shared/utils';
import React, { useMemo } from 'react';
import Image from 'next/image'; // Import Next.js Image component

interface FormDetailInfoProps {
  createdAt?: string | null;
  updatedAt?: string | null;
  createdBy?: CreatedBy | null;
  updatedBy?: UpdatedBy | null;
  className?: string;
}

const FormDetailInfo: React.FC<FormDetailInfoProps> = ({
  createdAt,
  updatedAt,
  createdBy,
  updatedBy,
  className,
}) => {
  const hasUpdateInfo = updatedBy;

  const created = useMemo(() => formatDateTime(createdAt), [createdAt]);
  const updated = useMemo(() => formatDateTime(updatedAt), [updatedAt]);

  return (
    <div className={cn('w-full border-none shadow-none p-0', className)}>
      {/* Use a responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm items-center">
        {/* Created Info - Label */}
        <span className="font-semibold col-span-1">Created By:</span>
        {/* Created Info - Value */}
        <div className="flex items-center gap-2 col-span-1 md:justify-end">
          {/* Avatar replacement for Created By */}
          <div className="relative w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-700 text-xs font-medium">
            {createdBy?.image ? (
              <Image
                src={createdBy.image}
                alt={createdBy?.name || 'User Avatar'}
                width={24} // Match container size (w-6 = 24px)
                height={24} // Match container size (h-6 = 24px)
                className="object-cover" // Ensure the image covers the container
              />
            ) : (
              <span>{createdBy?.name?.charAt(0) || 'N/A'}</span>
            )}
          </div>
          <span className="text-muted-foreground">{createdBy?.email || 'N/A'}</span>
        </div>

        {/* Created At - Label */}
        <span className="font-semibold col-span-1">Created At:</span>
        {/* Created At - Value */}
        <span className="text-muted-foreground col-span-1 md:text-right">{created}</span>

        {/* Updated Info (only show if has) */}
        {hasUpdateInfo && (
          <>
            {/* Separator - Spans all columns */}
            <Separator className="my-2 col-span-full" />

            {/* Updated By - Label */}
            <span className="font-semibold col-span-1">Updated By:</span>
            {/* Updated By - Value */}
            <div className="flex items-center gap-2 col-span-1 md:justify-end">
              {/* Avatar replacement for Updated By */}
              <div className="relative w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-200 text-gray-700 text-xs font-medium">
                {updatedBy?.image ? (
                  <Image
                    src={updatedBy.image}
                    alt={updatedBy?.name || 'User Avatar'}
                    width={24} // Match container size (w-6 = 24px)
                    height={24} // Match container size (h-6 = 24px)
                    className="object-cover" // Ensure the image covers the container
                  />
                ) : (
                  <span>{updatedBy?.name?.charAt(0) || 'N/A'}</span>
                )}
              </div>
              <span className="text-muted-foreground">{updatedBy?.email || 'N/A'}</span>
            </div>

            {/* Updated At - Label */}
            <span className="font-semibold col-span-1">Updated At:</span>
            {/* Updated At - Value */}
            <span className="text-muted-foreground col-span-1 md:text-right">{updated}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default FormDetailInfo;
