import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CommonTooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  delayDuration?: number;
  asChild?: boolean;
  disableHoverableContent?: boolean;
}

export function CommonTooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  className,
  delayDuration = 200,
  asChild = true,
  disableHoverableContent = false,
}: CommonTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration} disableHoverableContent={disableHoverableContent}>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          className={cn(
            'z-50 bg-white text-black dark:bg-black dark:text-white shadow-lg',
            className,
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
