import { Icons } from '@/components/Icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';
import { FC, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonCreationProps {
  action: () => void;
  toolTip?: string;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Icons | ReactNode | undefined;
  children?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
}

const ButtonCreation: FC<ButtonCreationProps> = ({
  action,
  toolTip,
  className,
  variant = 'primary',
  size = 'icon',
  icon = 'add',
  children,
  disabled = false,
  isLoading = false,
  type = 'button',
  ariaLabel,
  tooltipSide = 'top',
}) => {
  // Base styles for variants
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-500 hover:bg-blue-700 text-white',
    secondary:
      'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200',
    ghost:
      'bg-transparent hover:bg-gray-100 text-gray-800 dark:hover:bg-gray-800 dark:text-gray-200',
    destructive: 'bg-red-500 hover:bg-red-700 text-white',
  };

  // Base styles for sizes
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1 text-sm h-8',
    md: 'px-4 py-2 text-base h-10',
    lg: 'px-6 py-3 text-lg h-12',
    icon: 'p-2 h-10 w-10 rounded-full',
  };

  // Render icon
  const renderIcon = () => {
    if (isLoading) {
      return <Icons.loader className="h-5 w-5 animate-spin" />;
    }
    if (typeof icon === 'string' && icon in Icons) {
      const IconComponent = Icons[icon as keyof typeof Icons];
      return <IconComponent className={cn(size === 'sm' ? 'h-4 w-4' : 'h-6 w-6')} />;
    }
    return icon;
  };

  // Button content
  const buttonContent = (
    <>
      {icon && !children && renderIcon()}
      {children && (
        <span className={cn(icon && 'ml-2')}>
          {icon && renderIcon()}
          {children}
        </span>
      )}
    </>
  );

  // Button element
  const button = (
    <button
      data-test="button-creation"
      onClick={action}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        isLoading && 'pointer-events-none',
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      aria-label={ariaLabel || toolTip || 'Button'}
    >
      {buttonContent}
    </button>
  );

  // Render with or without tooltip
  if (!toolTip) {
    return button;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side={tooltipSide}>{toolTip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ButtonCreation;
