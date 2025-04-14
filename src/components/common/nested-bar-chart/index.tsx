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
  xAxisFormatter?: (value: number) => string;
  tooltipContent?: ContentType<ValueType, NameType>;
  legendItems?: { name: string; color: string }[];
  maxBarRatio?: number;
  tutorialText?: string;
  callback?: (item: any) => void;
  levelConfig?: LevelConfig;
  expanded?: boolean; // Controls initial expansion of the total bar
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
  expanded = true, // Default to true
}: NestedBarChartProps) => {
  // State to track which bars are expanded
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  // State to dynamically adjust chart height
  const [chartHeight, setChartHeight] = useState(MIN_CHART_HEIGHT);
  // Get window width for responsive design
  const { width } = useWindowSize();

  // Function to toggle the expansion of a bar
  const toggleExpand = useCallback((name: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }, []);

  // **Initial Data Processing**
  // Calculate total amount from the data
  const totalAmount = data.reduce((sum, item) => sum + Math.abs(item.value), 0);
  const totalName = levelConfig?.totalName || 'Total Amount';
  const totalColor = levelConfig?.colors[0] || '#888888';
  // Create the total bar item
  const totalItem: BarItem = {
    name: totalName,
    value: totalAmount,
    color: totalColor,
    type: data[0]?.type || 'unknown',
    children: data,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const chartData = [totalItem];

  // **Recursive Data Processing**
  // Builds the processed data array based on expanded items
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
        // If the item is expanded and has children, process them recursively
        if (expandedItems[item.name] && item.children && item.children.length > 0) {
          const children = buildProcessedData(item.children, item.name, itemValue, depth + 1);
          result.push(...children);
        }
      });
      return result;
    },
    [expandedItems, levelConfig],
  );

  // Memoize processed data to optimize performance
  const processedData = useMemo(
    () => buildProcessedData(chartData),
    [buildProcessedData, chartData],
  );

  // **Dynamic Chart Height**
  // Adjust chart height based on the number of visible bars
  useEffect(() => {
    const numBars = processedData.length;
    const newHeight = Math.max(numBars * BASE_BAR_HEIGHT, MIN_CHART_HEIGHT);
    setChartHeight(newHeight);
  }, [processedData]);

  // **X-Axis Domain Calculation**
  // Calculate the maximum absolute value for the X-axis
  const maxAbsValue = useMemo(() => {
    const allValues = data.flatMap((item) => [
      Math.abs(item.value),
      ...(item.children?.map((child) => Math.abs(child.value)) || []),
    ]);
    return Math.max(...allValues);
  }, [data]);

  // Define the X-axis domain
  const domain = useMemo(() => {
    if (maxAbsValue === 0) return [0, 1];
    const maxX = maxAbsValue / maxBarRatio;
    return [0, maxX];
  }, [maxAbsValue, maxBarRatio]);

  // **Responsive Margins**
  // Calculate chart margins based on window width
  const chartMargins = useMemo(() => getChartMargins(width), [width]);

  // **Custom Tooltip**
  // Define a custom tooltip with currency and locale formatting
  const customTooltipWithConfig = useCallback(
    (props: any) => (
      <CustomTooltip {...props} currency={currency} locale={locale} tutorialText={tutorialText} />
    ),
    [currency, locale, tutorialText],
  );

  // **Render the Chart**
  return (
    <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200">
      {/* Optional Title */}
      {title && (
        <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h2>
      )}
      {/* Chart Container with Dynamic Height */}
      <div style={{ height: `${chartHeight}px` }} className="transition-all duration-300">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={processedData}
            layout="vertical"
            margin={chartMargins}
            className="transition-all duration-300"
          >
            {/* Grid */}
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              className="dark:stroke-gray-600 transition-colors duration-200"
              horizontal={true}
              vertical={false}
            />
            {/* X-Axis */}
            <XAxis
              type="number"
              domain={domain}
              tickFormatter={xAxisFormatter}
              className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
            />
            {/* Y-Axis */}
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
            {/* Tooltip */}
            <Tooltip trigger="hover" content={tooltipContent || customTooltipWithConfig} />
            {/* Bar */}
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
      {/* Legend */}
      <ChartLegend items={legendItems || []} />
    </div>
  );
};

export default memo(NestedBarChart);
