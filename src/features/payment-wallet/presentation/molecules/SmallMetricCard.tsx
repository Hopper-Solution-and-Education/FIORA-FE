import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';

interface SmallMetricCardProps {
  title: string;
  value: number;
  type: 'income' | 'expense' | 'total' | 'neutral';
  className?: string;
  currency?: string;
}

const SmallMetricCard = ({ title, value, type, className, currency }: SmallMetricCardProps) => {
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
      case 'neutral':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };
  return (
    <Card className={cn('flex justify-between items-center overflow-hidden', className)}>
      <CardHeader className="flex w-fit flex-row items-center justify-start space-y-0 py-2 pr-0">
        <CardTitle className="w-fit text-ellipsis text-nowrap text-sm sm:text-md font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 pl-0">
        <div className={cn('text-xl sm:text-xl font-bold', getCardColor())}>
          {formatCurrency(value, currency || CURRENCY.FX)}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmallMetricCard;
