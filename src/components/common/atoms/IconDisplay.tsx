'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import LucieIcon from '@/features/home/module/category/components/LucieIcon';
import { cn } from '@/shared/utils';
import { isImageUrl } from '@/shared/utils';

interface IconDisplayProps {
  icon: string;
  className?: string;
  iconClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  isHovered?: boolean;
}

export const IconDisplay: React.FC<IconDisplayProps> = ({
  icon,
  className,
  iconClassName,
  onClick,
  isHovered,
}) => {
  if (isImageUrl(icon)) {
    return (
      <div
        className={cn(
          'h-8 w-8 rounded-full border overflow-hidden transition-all duration-300 cursor-pointer',
          isHovered ? 'bg-primary/20 shadow-sm' : 'hover:bg-muted/60',
          className,
        )}
        onClick={onClick}
      >
        <Image
          src={icon}
          alt="icon"
          width={32}
          height={32}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        'h-8 w-8 p-0 rounded-full border transition-all duration-300',
        isHovered ? 'bg-primary/20 shadow-sm' : 'hover:bg-muted/60',
        className,
      )}
      onClick={onClick}
    >
      <LucieIcon
        icon={icon}
        className={cn(
          'h-4 w-4 transition-all duration-200',
          isHovered ? 'text-primary' : 'text-muted-foreground',
          iconClassName,
        )}
      />
    </Button>
  );
};
