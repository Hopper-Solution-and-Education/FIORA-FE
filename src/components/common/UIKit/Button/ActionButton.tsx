import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Icons } from '@/components/Icon';
import { cn } from '@/shared/utils';
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
      data-test="action-button"
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
      <CommonTooltip side={tooltipSide} content={tooltipContent}>
        {button}
      </CommonTooltip>
    );
  }

  return button;
};

export default ActionButton;
