import { cn } from '@/shared/utils';
import React from 'react';
import { Icons } from '@/components/Icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ButtonProps } from './type';

interface ActionButtonProps extends ButtonProps {
  label?: string;
  tooltipContent?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
  redirectPath?: string;
}

const ActionButton = ({
  label,
  children,
  tooltipContent,
  tooltipSide = 'top',
  showIcon = true,
  className,
  ...props
}: ActionButtonProps) => {
  const buttonContent = (
    <>
      {showIcon && <Icons.add className="h-6 w-6" />}
      {label && <span className="ml-2">{label}</span>}
      {children}
    </>
  );

  const button = (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        'bg-blue-500 hover:bg-blue-700 text-white',
        'p-2 text-base rounded-full',
        className,
      )}
      aria-label={label || 'Add new'}
      {...props}
    >
      {buttonContent}
    </button>
  );

  if (tooltipContent) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side={tooltipSide}>
            <p>{tooltipContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};

export default ActionButton;
