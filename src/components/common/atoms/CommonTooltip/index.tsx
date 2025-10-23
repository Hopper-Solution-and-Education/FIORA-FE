import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
import { Fragment, ReactNode } from 'react';

interface CommonTooltipProps {
  children: ReactNode;
  content: ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  delayDuration?: number;
  asChild?: boolean;
  disableHoverableContent?: boolean;
  open?: boolean;
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
  open,
}: CommonTooltipProps) {
  return (
    <Tooltip
      open={open ? open : undefined}
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
    >
      <TooltipTrigger asChild={asChild}>
        <div>{children}</div>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        className={cn(
          'z-50 bg-white text-black dark:bg-black dark:text-white shadow-lg',
          className,
        )}
      >
        <Fragment>{content}</Fragment>
      </TooltipContent>
    </Tooltip>
  );
}
