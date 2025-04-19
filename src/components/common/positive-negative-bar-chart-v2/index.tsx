/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import {
  BASE_BAR_HEIGHT,
  COLORS,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  MIN_CHART_HEIGHT,
} from '@/shared/constants/chart';
import { getChartMargins, useWindowSize } from '@/shared/utils/device';
import debounce from 'lodash/debounce';
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
import { PositiveAndNegativeBarChartV2Props, TwoSideBarItem } from './types';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import {
  ChartLegend,
  CustomYAxisTick,
  PositiveAndNegativeV2BarLabel,
  PositiveAndNegativeV2Tooltip,
} from '@/components/common/atoms';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icon';
import { cn } from '@/shared/utils';
import {
  Tooltip as TooltipShadcn,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChartSkeleton } from '@/components/common/organisms';

const PositiveAndNegativeBarChartV2 = ({
  data,
  title,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
  xAxisFormatter = (value) =>
    new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value),
  tooltipContent,
  legendItems,
  tutorialText,
  callback,
  levelConfig,
  height = MIN_CHART_HEIGHT,
  baseBarHeight = BASE_BAR_HEIGHT,
  showTotal = false,
  totalName = 'Total',
  expanded = true,
  header,
}: PositiveAndNegativeBarChartV2Props) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [chartHeight, setChartHeight] = useState(height);
  const [showAll, setShowAll] = useState(false);
  const [isLoadingViewAll, setIsLoadingViewAll] = useState(false);
  const { width } = useWindowSize();
  const isMobile = useIsMobile();
  const BAR_GAP = 0;
  const BAR_CATEGORY_GAP = 10;

  // Toggle expand/collapse with debounce
  const toggleExpand = useCallback(
    debounce((name: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [name]: !prev[name],
      }));
    }, 100),
    [],
  );

  const handleToggleShowAll = useCallback(() => {
    setIsLoadingViewAll(true);
    setTimeout(() => {
      setShowAll((prev) => !prev);
      setIsLoadingViewAll(false);
    }, 200);
  }, []);

  // Calculate total item if showTotal is true
  const getTotalItem = useCallback((): TwoSideBarItem => {
    const totalPositive = data.reduce((sum, item) => sum + (item.positiveValue || 0), 0);
    const totalNegative = data.reduce((sum, item) => sum + (item.negativeValue || 0), 0);
    return {
      id: undefined,
      name: totalName,
      positiveValue: totalPositive,
      negativeValue: totalNegative,
      colorPositive: levelConfig?.colorPositive[0] || COLORS.DEPS_SUCCESS.LEVEL_2,
      colorNegative: levelConfig?.colorNegative[0] || COLORS.DEPS_DANGER.LEVEL_2,
      type: 'total',
      depth: 0,
      isChild: false,
    };
  }, [data, totalName, levelConfig]);

  // Prepare chart data with total item and handle showAll
  const preparedData = useMemo(() => {
    let items = data;
    if (!showAll && data.length > 5) {
      const first5 = data.slice(0, 5);
      const others = data.slice(5);
      const othersTotal = others.reduce(
        (acc, item) => ({
          positiveValue: acc.positiveValue + (item.positiveValue || 0),
          negativeValue: acc.negativeValue + (item.negativeValue || 0),
        }),
        { positiveValue: 0, negativeValue: 0 },
      );
      items = [
        ...first5,
        {
          id: undefined,
          name: `Others (${others.length} items)`,
          positiveValue: othersTotal.positiveValue,
          negativeValue: othersTotal.negativeValue,
          icon: 'expand',
          type: 'others',
          colorPositive: COLORS.DEPS_SUCCESS.LEVEL_2,
          colorNegative: COLORS.DEPS_DANGER.LEVEL_2,
          isOthers: true,
        },
      ];
    }
    if (showTotal) {
      const totalItem = getTotalItem();
      return [totalItem, ...items];
    }
    return items;
  }, [data, showAll, showTotal, getTotalItem]);

  // Count only main bars (excluding sub-bars)
  const mainBarCount = useMemo(() => {
    if (showAll) return data.length;
    return Math.min(data.length, 5) + (data.length > 5 ? 1 : 0);
  }, [data.length, showAll]);

  // Sync the expanded state of the total bar with the `expanded` prop
  useEffect(() => {
    setExpandedItems((prev) => ({
      ...prev,
      [totalName]: expanded,
    }));
  }, [expanded, totalName]);

  // Flatten hierarchical data based on expanded items
  const buildProcessedData = useCallback(
    (items: TwoSideBarItem[], depth: number = 0, parent?: string): TwoSideBarItem[] => {
      const result: TwoSideBarItem[] = [];
      items.forEach((item) => {
        const currentItem: TwoSideBarItem = {
          ...item,
          colorPositive:
            levelConfig?.colorPositive[depth] || item.colorPositive || COLORS.DEPS_SUCCESS.LEVEL_2,
          colorNegative:
            levelConfig?.colorNegative[depth] || item.colorNegative || COLORS.DEPS_DANGER.LEVEL_2,
          depth,
          parent,
          isChild: !!parent,
        };
        result.push(currentItem);
        if (expandedItems[item.name] && item.children && item.children.length > 0) {
          const children = buildProcessedData(item.children, depth + 1, item.name);
          result.push(...children);
        }
      });
      return result;
    },
    [expandedItems, levelConfig],
  );

  const visibleData = useMemo(
    () => buildProcessedData(preparedData),
    [buildProcessedData, preparedData],
  );

  // Calculate max absolute value for X-axis
  const maxAbsValue = useMemo(() => {
    const allValues = visibleData.flatMap((item) => [
      Math.abs(item.negativeValue || 0),
      Math.abs(item.positiveValue || 0),
    ]);
    return Math.max(...allValues, 0) || 1;
  }, [visibleData]);

  // Update chart height based on number of visible bars
  useEffect(() => {
    const numBars = visibleData.length;
    const newHeight = Math.max(numBars * baseBarHeight, height);
    setChartHeight(newHeight);
  }, [visibleData, baseBarHeight, height]);

  // Compute margins
  const negativeChartMargins = useMemo(
    () => ({
      ...getChartMargins(width),
      right: 0,
      left: 40,
    }),
    [width],
  );

  const positiveChartMargins = useMemo(
    () => ({
      ...getChartMargins(width),
      left: isMobile ? 10 : 0,
    }),
    [width, isMobile],
  );

  // Memoized tooltip
  const customTooltipWithConfig = useCallback(
    (props: any) => (
      <PositiveAndNegativeV2Tooltip
        {...props}
        currency={currency}
        locale={locale}
        tutorialText={tutorialText}
        formatter={xAxisFormatter}
      />
    ),
    [currency, locale, tutorialText, xAxisFormatter],
  );

  // Render Skeleton Loading
  const renderSkeleton = () => <ChartSkeleton />;

  return (
    <div className="w-full transition-colors rounded-lg py-4 duration-200">
      <div className="flex justify-between items-center mb-4">
        {header || (
          <>
            {title && (
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
            )}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Showing {mainBarCount} of {data.length} items
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
                        disabled={isLoadingViewAll}
                      >
                        {isLoadingViewAll ? (
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
          </>
        )}
      </div>
      {isMobile && <ChartLegend items={legendItems} />}
      <div
        style={{ height: `${chartHeight}px` }}
        className="transition-all duration-300 flex flex-col md:flex-row"
      >
        {isLoadingViewAll ? (
          renderSkeleton()
        ) : (
          <>
            {/* Negative Chart */}
            <ResponsiveContainer width="100%" height={chartHeight} className="md:w-1/2">
              <BarChart
                data={visibleData}
                layout="vertical"
                margin={negativeChartMargins}
                barCategoryGap={BAR_CATEGORY_GAP}
                barGap={BAR_GAP}
                className="transition-all duration-300"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  className="dark:stroke-gray-600 transition-colors duration-200"
                />
                <XAxis
                  type="number"
                  domain={[maxAbsValue, 0]}
                  tickFormatter={(value) => xAxisFormatter(Math.abs(value))}
                  className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
                  tick={(props) => (
                    <CustomYAxisTick
                      {...props}
                      processedData={visibleData}
                      expandedItems={expandedItems}
                      onToggleExpand={toggleExpand}
                      callback={callback}
                    />
                  )}
                />
                <Tooltip
                  trigger="hover"
                  content={tooltipContent || customTooltipWithConfig}
                  cursor={false}
                />
                <Bar
                  dataKey="negativeValue"
                  label={(props) => (
                    <PositiveAndNegativeV2BarLabel {...props} formatter={xAxisFormatter} />
                  )}
                  onClick={(props) => {
                    const item = props.payload;
                    if (item.isOthers) {
                      handleToggleShowAll();
                    } else if (callback) {
                      callback(item);
                    }
                  }}
                  className="transition-all duration-300 cursor-pointer"
                >
                  {visibleData.map((entry, index) => (
                    <Cell key={`negative-cell-${index}`} fill={entry.colorNegative} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* Positive Chart */}
            <ResponsiveContainer
              width="100%"
              height={chartHeight}
              className={`md:w-1/2 ${isMobile && 'mt-10'}`}
            >
              <BarChart
                data={visibleData}
                layout="vertical"
                margin={positiveChartMargins}
                barCategoryGap={BAR_CATEGORY_GAP}
                barGap={BAR_GAP}
                className="transition-all duration-300"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#E5E7EB"
                  className="dark:stroke-gray-600 transition-colors duration-200"
                />
                <XAxis
                  type="number"
                  domain={[0, maxAbsValue]}
                  tickFormatter={(value) => xAxisFormatter(Math.abs(value))}
                  className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  width={isMobile ? 70 : 0}
                  className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
                  tick={(props) => (
                    <CustomYAxisTick
                      {...props}
                      processedData={visibleData}
                      expandedItems={expandedItems}
                      onToggleExpand={toggleExpand}
                      callback={callback}
                    />
                  )}
                />
                <Tooltip
                  trigger="hover"
                  content={tooltipContent || customTooltipWithConfig}
                  cursor={false}
                />
                <Bar
                  dataKey="positiveValue"
                  label={(props) => (
                    <PositiveAndNegativeV2BarLabel {...props} formatter={xAxisFormatter} />
                  )}
                  onClick={(props) => {
                    const item = props.payload;
                    if (item.isOthers) {
                      handleToggleShowAll();
                    } else if (callback) {
                      callback(item);
                    }
                  }}
                  className="transition-all duration-300 cursor-pointer"
                >
                  {visibleData.map((entry, index) => (
                    <Cell key={`positive-cell-${index}`} fill={entry.colorPositive} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
      {!isMobile && <ChartLegend items={legendItems} />}
    </div>
  );
};

export default PositiveAndNegativeBarChartV2;
