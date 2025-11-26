import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LucieIcon from '@/features/home/module/category/components/LucieIcon';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { cn, isImageUrl } from '@/shared/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import Image from 'next/image';

interface MetricCardProps {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'total' | 'neutral' | 'gray';
  description?: string;
  icon?: string | React.ReactNode;
  className?: string;
  currency?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  applyExchangeRate?: boolean;
}

const MetricCard = ({
  title,
  value,
  type,
  description,
  icon,
  className,
  trend,
  currency,
  applyExchangeRate = true,
}: MetricCardProps) => {
  const { formatCurrency } = useCurrencyFormatter();
  const getCardColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
        return 'text-red-600 dark:text-red-400';
      case 'total':
        if (Number(value) >= 0) {
          return 'text-blue-600 dark:text-blue-400';
        } else {
          return 'text-yellow-600 dark:text-yellow-400';
        }
      case 'gray':
        return 'text-gray-400 dark:text-gray-600';
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

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
      if (isImageUrl(iconValue)) {
        return (
          <div className="w-5 h-5 rounded-full overflow-hidden">
            <Image
              src={iconValue}
              alt="logo"
              width={20}
              height={20}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement?.classList.add(
                  'flex',
                  'items-center',
                  'justify-center',
                  'bg-gray-100',
                );
                const fallbackIcon = document.createElement('div');
                fallbackIcon.innerHTML =
                  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 text-gray-400"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 0 0-16 0"></path></svg>';
                e.currentTarget.parentElement?.appendChild(fallbackIcon.firstChild as Node);
              }}
            />
          </div>
        );
      }
      return <LucieIcon icon={iconValue} className={cn('w-4 h-4', getCardColor())} />;
    }

    return iconValue;
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm sm:text-md font-medium">{title}</CardTitle>
        {renderIconOrImage(icon)}
      </CardHeader>
      <CardContent>
        <div className={cn('text-xl sm:text-2xl font-bold', getCardColor())}>
          {formatCurrency(value, currency || CURRENCY.FX, { applyExchangeRate: false })}
        </div>
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

export default MetricCard;
