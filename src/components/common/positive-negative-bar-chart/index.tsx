/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  BASE_BAR_HEIGHT,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  DEFAULT_MAX_BAR_RATIO,
  MIN_CHART_HEIGHT,
} from '@/shared/constants/chart';
import { getChartMargins, useWindowSize } from '@/shared/utils/device';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { ContentType } from 'recharts/types/component/Tooltip';
import { debounce } from 'lodash';
import {
  PositiveAndNegativeBarLabel,
  ChartLegend,
  CustomTooltip,
  CustomYAxisTick,
} from '@/components/common/atoms';

export type BarItem = {
  id?: string;
  icon?: string;
  name: string;
  value: number;
  color?: string;
  type: string;
  parent?: string;
  children?: BarItem[];
  isChild?: boolean;
  depth?: number;
};

export type PositiveAndNegativeBarLevelConfig = {
  totalName?: string;
  colorPositive: {
    [depth: number]: string;
  };
  colorNegative: {
    [depth: number]: string;
  };
};

export type PositiveAndNegativeBarChartProps = {
  data: BarItem[];
  title?: string;
  currency?: string;
  locale?: string;
  xAxisFormatter?: (value: number) => string;
  tooltipContent?: ContentType<ValueType, NameType>;
  legendItems?: { name: string; color: string }[];
  maxBarRatio?: number;
  tutorialText?: string;
  callback?: (item: any) => void;
  levelConfig?: PositiveAndNegativeBarLevelConfig;
  height?: number;
  baseBarHeight?: number;
  expanded?: boolean;
  header?: React.ReactNode;
};

const PositiveAndNegativeBarChart = ({
  data,
  title,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  maxBarRatio = DEFAULT_MAX_BAR_RATIO,
  xAxisFormatter = (value) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value),
  tooltipContent,
  legendItems,
  tutorialText,
  callback,
  levelConfig,
  height = MIN_CHART_HEIGHT,
  baseBarHeight = BASE_BAR_HEIGHT,
  expanded = true,
  header,
}: PositiveAndNegativeBarChartProps) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [chartHeight, setChartHeight] = useState(height);
  const { width } = useWindowSize();

  const toggleExpand = useCallback(
    debounce((name: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [name]: !prev[name],
      }));
    }, 100),
    [],
  );

  // Initial data processing
  const totalAmount = data.reduce((sum, item) => sum + item.value, 0);
  const totalName = levelConfig?.totalName || 'Net Total';
  const totalItem: BarItem = {
    name: totalName,
    value: totalAmount,
    color: totalAmount > 0 ? levelConfig?.colorPositive[0] : levelConfig?.colorNegative[0],
    type: data[0]?.type || 'unknown',
    children: data,
    depth: 0,
  };
  const chartData = [totalItem];

  // Sync the expanded state of the total bar with the `expanded` prop
  useEffect(() => {
    setExpandedItems((prev) => ({
      ...prev,
      [totalName]: expanded,
    }));
  }, [expanded, totalName]);

  // Recursive function to process data with multiple levels
  const buildProcessedData = useCallback(
    (items: BarItem[], parentName?: string, depth: number = 0): BarItem[] => {
      const result: BarItem[] = [];
      items.forEach((item) => {
        const currentItem = {
          ...item,
          color:
            item.value > 0 ? levelConfig?.colorPositive[depth] : levelConfig?.colorNegative[depth],
          parent: parentName,
          isChild: !!parentName,
          depth,
        };
        result.push(currentItem);
        if (expandedItems[item.name] && item.children && item.children.length > 0) {
          const children = buildProcessedData(item.children, item.name, depth + 1);
          result.push(...children);
        }
      });
      return result;
    },
    [expandedItems, levelConfig],
  );

  const processedData = useMemo(
    () => buildProcessedData(chartData),
    [buildProcessedData, chartData],
  );

  // Calculate maximum absolute value for X-axis domain
  const maxAbsValue = useMemo(() => {
    const absValues = processedData.map((item) => Math.abs(item.value));
    return Math.max(...absValues, 0) || 1; // Default to 1 if all values are 0
  }, [processedData]);

  // Update chart height based on number of visible bars
  useEffect(() => {
    const numBars = processedData.length;
    const newHeight = Math.max(numBars * baseBarHeight, height);
    setChartHeight(newHeight);
  }, [processedData]);

  // Dynamic margins based on window width
  const chartMargins = useMemo(() => getChartMargins(width), [width]);

  // Custom tooltip with currency and locale
  const customTooltipWithConfig = useCallback(
    (props: any) => (
      <CustomTooltip {...props} currency={currency} locale={locale} tutorialText={tutorialText} />
    ),
    [currency, locale, tutorialText],
  );

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200">
      {header ||
        (title && (
          <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {title}
          </h2>
        ))}
      <div style={{ height: `${chartHeight}px` }} className="transition-all duration-300">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={processedData}
            layout="vertical"
            margin={chartMargins}
            className="transition-all duration-300"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              className="dark:stroke-gray-600 transition-colors duration-200"
            />
            <XAxis
              type="number"
              domain={[-maxAbsValue, maxAbsValue]}
              tickFormatter={xAxisFormatter}
              className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
            />
            <YAxis
              type="category"
              dataKey="name"
              className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
              tickLine={false}
              axisLine={false}
              tick={(props) => (
                <CustomYAxisTick
                  {...props}
                  processedData={processedData}
                  expandedItems={expandedItems}
                  onToggleExpand={toggleExpand}
                  callback={callback}
                />
              )}
            />
            <Tooltip trigger="hover" content={tooltipContent || customTooltipWithConfig} />
            <Bar
              dataKey="value"
              className="transition-all duration-300 cursor-pointer"
              label={(props) => (
                <PositiveAndNegativeBarLabel
                  {...props}
                  currency={currency}
                  formatter={xAxisFormatter}
                />
              )}
              onClick={(props) => {
                if (callback) return callback(props);
              }}
            >
              {processedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend items={legendItems || []} />
    </div>
  );
};

export default PositiveAndNegativeBarChart;
