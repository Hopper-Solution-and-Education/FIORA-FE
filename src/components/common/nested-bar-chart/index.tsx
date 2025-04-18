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
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
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
import { debounce } from 'lodash';

// Define the structure of a bar item
export type BarItem = {
  id?: string;
  icon?: string;
  name: string;
  value: number;
  color: string;
  type: string;
  parent?: string;
  children?: BarItem[];
  isChild?: boolean;
  depth?: number;
  isOthers?: boolean;
};

// Configuration for levels in the chart
export type LevelConfig = {
  totalName?: string;
  colors: {
    [depth: number]: string;
  };
};

// Props for the NestedBarChart component
export type NestedBarChartProps = {
  data: BarItem[];
  title?: string;
  currency?: string;
  locale?: string;
  tooltipContent?: ContentType<ValueType, NameType>;
  legendItems?: { name: string; color: string }[];
  maxBarRatio?: number;
  tutorialText?: string;
  levelConfig?: LevelConfig;
  expanded?: boolean;
  xAxisFormatter?: (value: number) => string;
  callback?: (item: any) => void;
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
  expanded = true,
}: NestedBarChartProps) => {
  // State to track whether to show all categories or just top 10
  const [showAll, setShowAll] = useState(false);
  // State to track loading during expand/collapse
  const [isLoading, setIsLoading] = useState(false);
  // State to track which bars are expanded
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  // State to dynamically adjust chart height
  const [chartHeight, setChartHeight] = useState(MIN_CHART_HEIGHT);
  // Get window width for responsive design
  const { width } = useWindowSize();

  // Function to toggle the expansion of a bar
  const toggleExpand = useCallback(
    debounce((name: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [name]: !prev[name],
      }));
    }, 100),
    [],
  );

  // Function to toggle showAll with fake loading
  const handleToggleShowAll = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setShowAll((prev) => !prev); // Toggle between showing all and top 10
      setIsLoading(false);
    }, 500); // Fake delay of 500ms
  }, []);

  // **Prepare Initial Data: First 10 + Others**
  const preparedData = useMemo(() => {
    if (showAll) return data; // Show all data if toggled
    const first10 = data.slice(0, 10); // Take first 10 (assumes parent has sorted)
    const othersSum = data.slice(10).reduce((sum, item) => sum + item.value, 0); // Sum remaining
    if (data.length > 10) {
      const othersItem: BarItem = {
        name: `Others (${data[0]?.type || 'unknown'})`, // e.g., "Others (Expense)"
        value: othersSum,
        color: levelConfig?.colors[0] || '#888888', // Default color for "Others"
        type: data[0]?.type || 'unknown',
        isOthers: true, // Mark as "Others" bar
      };
      return [...first10, othersItem]; // Combine first 10 with "Others"
    }
    return first10; // If ≤ 10 items, return as is
  }, [data, showAll, levelConfig]);

  // **Calculate Total Bar**
  const totalAmount = preparedData.reduce((sum, item) => sum + Math.abs(item.value), 0);
  const totalName = levelConfig?.totalName || 'Total Amount';
  const totalColor = levelConfig?.colors[0] || '#888888';
  const totalItem: BarItem = {
    name: totalName,
    value: totalAmount,
    color: totalColor,
    type: preparedData[0]?.type || 'unknown',
    children: preparedData, // Use prepared data (first 10 + Others or all)
    depth: 0,
  };

  // Sync the expanded state of the total bar with the `expanded` prop
  useEffect(() => {
    setExpandedItems((prev) => ({
      ...prev,
      [totalName]: expanded,
    }));
  }, [expanded, totalName]);

  // Base chart data starts with the total item
  const chartData = [totalItem];

  // **Recursive Data Processing**
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

  // Memoize processed data
  const processedData = useMemo(
    () => buildProcessedData(chartData),
    [buildProcessedData, chartData],
  );

  // **Dynamic Chart Height**
  useEffect(() => {
    const numBars = processedData.length;
    const newHeight = Math.max(numBars * BASE_BAR_HEIGHT, MIN_CHART_HEIGHT);
    setChartHeight(newHeight);
  }, [processedData]);

  // **X-Axis Domain Calculation**
  const maxAbsValue = useMemo(() => {
    const allValues = preparedData.flatMap((item) => [
      Math.abs(item.value),
      ...(item.children?.map((child) => Math.abs(child.value)) || []),
    ]);
    return Math.max(...allValues);
  }, [preparedData]);

  const domain = useMemo(() => {
    if (maxAbsValue === 0) return [0, 1];
    const maxX = maxAbsValue / maxBarRatio;
    return [0, maxX];
  }, [maxAbsValue, maxBarRatio]);

  // **Responsive Margins**
  const chartMargins = useMemo(() => getChartMargins(width), [width]);

  // **Custom Tooltip**
  const customTooltipWithConfig = useCallback(
    (props: any) => (
      <CustomTooltip {...props} currency={currency} locale={locale} tutorialText={tutorialText} />
    ),
    [currency, locale, tutorialText],
  );

  // **Render the Chart**
  return (
    <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200">
      {title && (
        <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h2>
      )}
      <div style={{ height: `${chartHeight}px` }} className="transition-all duration-300">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
          </div>
        ) : (
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
                    setShowAll={handleToggleShowAll} // Pass the toggle function
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
                  const item = props.payload;
                  if (item.isOthers) {
                    handleToggleShowAll(); // Toggle showAll when "Others" bar is clicked
                  } else if (callback) {
                    callback(item); // Handle regular item clicks (e.g., navigation)
                  }
                }}
              >
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <ChartLegend items={legendItems || []} />
    </div>
  );
};

export default memo(NestedBarChart);
