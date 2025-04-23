import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/shared/constants/chart';
import { memo } from 'react';
import { BarItem } from '../nested-bar-chart/type';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  currency?: string;
  locale?: string;
  tutorialText?: string;
}

const CustomTooltip = ({
  active,
  payload,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
  tutorialText,
}: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const item: BarItem = payload[0].payload;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-3 rounded-md">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {item.type}:{' '}
        <span className="font-bold">
          {new Intl.NumberFormat(locale, { style: 'currency', currency }).format(item.value)}
        </span>
      </p>
      {item.parent && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Parent: <span className="font-medium">{item.parent}</span>
        </p>
      )}
      {tutorialText && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{tutorialText}</p>
      )}
    </div>
  );
};

export default memo(CustomTooltip);
