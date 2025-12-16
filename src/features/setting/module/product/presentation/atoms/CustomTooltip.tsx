import { DEFAULT_CURRENCY } from '@/shared/constants';
import { useCurrencyFormatter } from '@/shared/hooks';
import { Currency } from '@/shared/types';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  currency?: string;
  tutorialText?: string;
}

const CustomTooltip = ({
  active,
  payload,
  currency = DEFAULT_CURRENCY,
  tutorialText,
}: CustomTooltipProps) => {
  const { formatCurrency } = useCurrencyFormatter();

  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload; // Dữ liệu của hàng hiện tại

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-3 rounded-md">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Expense:{' '}
        <span className="font-bold">{formatCurrency(item.expense, currency as Currency)}</span>
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Income:{' '}
        <span className="font-bold">{formatCurrency(item.income, currency as Currency)}</span>
      </p>
      {tutorialText && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{tutorialText}</p>
      )}
    </div>
  );
};

export default CustomTooltip;
