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
import { Button } from '@/components/ui/button';
import {
  Tooltip as TooltipShadcn,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Icons } from '@/components/Icon';
import { debounce } from 'lodash';
import { cn } from '@/shared/utils';
import { BarLabel, ChartLegend, CustomTooltip, CustomYAxisTick } from '@/components/common/atoms';
import { ChartSkeleton } from '@/components/common/organisms';
import { BarItem, NestedBarChartProps } from './type';

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
  const [isLoading, setIsLoading] = useState(true);
  // State to track which bars are expanded
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  // State to dynamically adjust chart height
  const [chartHeight, setChartHeight] = useState(MIN_CHART_HEIGHT);
  // Get window width for responsive design
  const { width } = useWindowSize();

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

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
      setShowAll((prev) => !prev);
      setIsLoading(false);
    }, 200);
  }, []);

  // Prepare Initial Data: First 5 + Others
  const preparedData = useMemo(() => {
    if (showAll) return data;
    const first5 = data.slice(0, 5);
    const othersSum = data.slice(5).reduce((sum, item) => sum + item.value, 0);
    if (data.length > 5) {
      const othersItem: BarItem = {
        id: undefined,
        name: `Others (${data[0]?.type || 'unknown'})`,
        value: othersSum,
        color: levelConfig?.colors[0] || '#888888',
        type: data[0]?.type || 'unknown',
        icon: 'expand',
        isOthers: true,
      };
      return [...first5, othersItem];
    }
    return first5;
  }, [data, showAll, levelConfig]);

  // Calculate Total Bar
  const totalAmount = preparedData.reduce((sum, item) => sum + Math.abs(item.value), 0);
  const totalName = levelConfig?.totalName || 'Total Amount';
  const totalColor = levelConfig?.colors[0] || '#888888';
  const totalItem: BarItem = {
    name: totalName,
    value: totalAmount,
    color: totalColor,
    type: preparedData[0]?.type || 'unknown',
    children: preparedData,
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

  // Recursive Data Processing
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

  // Dynamic Chart Height
  useEffect(() => {
    const numBars = processedData.length;
    const newHeight = Math.max(numBars * BASE_BAR_HEIGHT, MIN_CHART_HEIGHT);
    setChartHeight(newHeight);
  }, [processedData]);

  // X-Axis Domain Calculation
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

  // Responsive Margins
  const chartMargins = useMemo(() => getChartMargins(width), [width]);

  // Custom Tooltip
  const customTooltipWithConfig = useCallback(
    (props: any) => (
      <CustomTooltip {...props} currency={currency} locale={locale} tutorialText={tutorialText} />
    ),
    [currency, locale, tutorialText],
  );

  // Render Skeleton Loading
  const renderSkeleton = () => <ChartSkeleton />;

  // Render the Chart
  return (
    <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Showing {preparedData.length} of {data.length} items
            </span>
            {data.length > 5 && (
              <TooltipProvider>
                <TooltipShadcn>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleShowAll}
                      className="h-8 w-8 hover:bg-primary/10 relative"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Icons.spinner className="h-5 w-5 text-primary animate-spin" />
                      ) : showAll ? (
                        <Icons.shrink
                          className={cn(
                            'h-5 w-5 transition-colors duration-200 text-primary dark:text-gray-400',
                          )}
                        />
                      ) : (
                        <Icons.expand
                          className={cn(
                            'h-5 w-5 transition-colors duration-200 text-primary dark:text-gray-400',
                          )}
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>{showAll ? 'Show Less' : 'View All'}</span>
                  </TooltipContent>
                </TooltipShadcn>
              </TooltipProvider>
            )}
          </div>
        </div>
      )}
      <div style={{ height: `${chartHeight}px` }} className="transition-all duration-300">
        {isLoading ? (
          renderSkeleton()
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
                    setShowAll={handleToggleShowAll}
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
                    handleToggleShowAll();
                  } else if (callback) {
                    callback(item);
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
