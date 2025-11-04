import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { cn } from '@/shared/utils';
import React, { ReactNode } from 'react';

interface NavItemProps extends React.ComponentProps<'div'> {
  label: string;
  tooltip?: string;
  icon?: ReactNode;
  showLabel?: boolean;
}

export const NavItem = ({
  label,
  tooltip,
  onClick,
  icon,
  children,
  className,
  showLabel = true,
  ...props
}: NavItemProps) => {
  const content = (
    <div
      className={cn(
        'flex flex-col gap-1 justify-center items-center cursor-pointer group',
        className,
      )}
      {...props}
    >
      <div className="p-2 rounded-lg transition-all duration-200 group-hover:bg-primary/10 dark:group-hover:bg-primary/20">
        {children || icon}
      </div>
      {showLabel && (
        <span className="text-xs font-medium transition-colors duration-200 text-foreground group-hover:text-primary">
          {label}
        </span>
      )}
    </div>
  );

  if (tooltip) {
    return <CommonTooltip content={tooltip}>{content}</CommonTooltip>;
  }

  return content;
};
