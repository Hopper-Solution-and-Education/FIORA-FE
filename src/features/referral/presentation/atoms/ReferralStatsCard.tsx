'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCurrencyFormatter } from '@/shared/hooks';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import React from 'react';

interface ReferralStatsCardProps {
  title: string;
  value: string | number;
  currency?: string;
  icon?: string | React.ReactNode;
  description?: string;
  isLoading?: boolean;
  tone?: 'green' | 'gray' | 'red';
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
}

type ToneKey = NonNullable<ReferralStatsCardProps['tone']>;

const toneStyles: Record<ToneKey, { value: string; icon: string }> = {
  green: {
    value: 'text-green-600 dark:text-green-400',
    icon: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  },
  gray: {
    value: 'text-gray-600 dark:text-gray-400',
    icon: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  },
  red: {
    value: 'text-red-600 dark:text-red-400',
    icon: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  },
};

const ReferralStatsCard = ({
  title,
  value,
  currency,
  icon,
  description,
  isLoading = false,
  tone = 'gray',
  trend,
  className,
  onClick,
  isActive = false,
}: ReferralStatsCardProps) => {
  const { formatCurrency } = useCurrencyFormatter();

  if (isLoading) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-5 w-5 rounded-full bg-muted animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-6 w-28 rounded bg-muted animate-pulse mb-2" />
          <div className="h-3 w-36 rounded bg-muted animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  const toneClass = toneStyles[tone];

  const getTrendIcon = () => {
    if (!trend) return null;
    return trend.isPositive ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = () => {
    if (!trend) return '';
    return trend.isPositive ? 'text-green-500' : 'text-red-500';
  };

  const renderIconOrImage = (iconValue?: string | React.ReactNode) => {
    if (!iconValue) {
      return null;
    }

    if (typeof iconValue === 'string') {
      return (
        <div className={cn('w-4 h-4', toneClass.value)}>
          <div className="w-4 h-4" />
        </div>
      );
    }

    if (React.isValidElement(iconValue)) {
      return React.cloneElement(
        iconValue as React.ReactElement,
        {
          className: cn('w-4 h-4', toneClass.value),
        } as any,
      );
    }

    return iconValue;
  };

  const displayValue =
    typeof value === 'number' ? `${formatCurrency(value, currency || 'USD')} FX` : `${value} FX`;

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!onClick) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <Card
      className={cn(
        'overflow-hidden transition-colors',
        onClick &&
          'cursor-pointer hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        isActive && 'border-primary bg-primary/5 shadow-sm',
        className,
      )}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? isActive : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm sm:text-md font-medium">{title}</CardTitle>
        {renderIconOrImage(icon)}
      </CardHeader>
      <CardContent>
        <div className={cn('text-xl sm:text-2xl font-bold', toneClass.value)}>{displayValue}</div>
        {(description || trend) && (
          <div className="mt-1 flex items-center text-[10px] sm:text-xs">
            {description && <p className="text-muted-foreground">{description}</p>}
            {trend && (
              <div className={cn('ml-2 flex items-center', getTrendColor())}>
                {getTrendIcon()}
                <span className="ml-1">{Math.abs(Number(trend.value))}%</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralStatsCard;
