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
import BarLabel from './atoms/BarLabel';
import ChartLegend from './atoms/ChartLegend';
import CustomTooltip from './atoms/CustomTooltip';
import CustomYAxisTick from './atoms/CustomYAxisTick';

export type BarItem = {
  id?: string;
  name: string;
  value: number;
  color: string;
  type: string;
  parent?: string;
  children?: BarItem[];
  isChild?: boolean;
  depth?: number;
};

export type LevelConfig = {
  totalName?: string;
  colors: {
    [depth: number]: string;
  };
};

export type NestedBarChartProps = {
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
  levelConfig?: LevelConfig;
};

const NestedBarChart = ({
  data,
  title,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
  maxBarRatio = DEFAULT_MAX_BAR_RATIO,
  xAxisFormatter = (value) => value.toString(),
  tooltipContent,
  legendItems,
  tutorialText,
  callback,
  levelConfig,
}: NestedBarChartProps) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [chartHeight, setChartHeight] = useState(MIN_CHART_HEIGHT);
  const { width } = useWindowSize();

  const toggleExpand = useCallback((name: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }, []);

  // * INITIAL DATA PROCESSING *
  const totalAmount = data.reduce((sum, item) => sum + Math.abs(item.value), 0);
  const totalName = levelConfig?.totalName || 'Total Amount';
  const totalColor = levelConfig?.colors[0] || '#888888';
  const totalItem: BarItem = {
    name: totalName,
    value: totalAmount,
    color: totalColor,
    type: data[0]?.type || 'unknown',
    children: data,
    depth: 0,
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chartData = [totalItem];

  // Recursive function to process data with multiple levels
  const buildProcessedData = useCallback(
    (items: BarItem[], parentName?: string, parentValue?: number, depth: number = 0): BarItem[] => {
      const result: BarItem[] = [];
      items.forEach((item) => {
        const itemValue = Math.abs(item.value);
        const color = levelConfig?.colors[depth] || item.color || '#888888';
        const currentItem = {
          ...item,
          value: parentValue ? Math.min(itemValue, parentValue) : itemValue,
          color,
          parent: parentName,
          isChild: !!parentName,
          depth,
        };
        result.push(currentItem);
        if (expandedItems[item.name] && item.children && item.children.length > 0) {
          const children = buildProcessedData(item.children, item.name, itemValue, depth + 1);
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

  // Update chart height based on number of visible bars
  useEffect(() => {
    const numBars = processedData.length;
    const newHeight = Math.max(numBars * BASE_BAR_HEIGHT, MIN_CHART_HEIGHT);
    setChartHeight(newHeight);
  }, [processedData]);

  // Calculate maximum absolute value for X-axis domain
  const maxAbsValue = useMemo(() => {
    const allValues = data.flatMap((item) => [
      Math.abs(item.value),
      ...(item.children?.map((child) => Math.abs(child.value)) || []),
    ]);
    return Math.max(...allValues);
  }, [data]);

  const domain = useMemo(() => {
    if (maxAbsValue === 0) return [0, 1];
    const maxX = maxAbsValue / maxBarRatio;
    return [0, maxX];
  }, [maxAbsValue, maxBarRatio]);

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
      {title && (
        <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h2>
      )}
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
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              domain={domain}
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
              radius={[0, 4, 4, 0]}
              className="transition-all duration-300 cursor-pointer"
              label={(props) => <BarLabel {...props} formatter={xAxisFormatter} />}
              onClick={(props) => {
                if (callback) return callback(props);
              }}
            >
              {processedData.map((entry, index) => {
                const color = entry.isChild
                  ? entry.color + Math.round(255).toString(16).padStart(2, '0')
                  : entry.color;
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend items={legendItems || []} />
    </div>
  );
};

export default NestedBarChart;
