import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/shared/constants/chart';

interface TwoSideBarChartV2TooltipProps {
  active?: boolean;
  payload?: any[];
  currency?: string;
  locale?: string;
  tutorialText?: string;
  formatter: (value: number) => string;
}

const TwoSideBarChartV2Tooltip = ({
  active,
  payload,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  currency = DEFAULT_CURRENCY,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  locale = DEFAULT_LOCALE,
  tutorialText,
  formatter,
}: TwoSideBarChartV2TooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-3 rounded-md">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Negative Value: <span className="font-bold">{formatter(item.negativeValue)}</span>
      </p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Positive Value: <span className="font-bold">{formatter(item.positiveValue)}</span>
      </p>
      {tutorialText && (
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{tutorialText}</p>
      )}
    </div>
  );
};

export default TwoSideBarChartV2Tooltip;
