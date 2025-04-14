'use client';

import ChartLegend from '@/components/common/nested-bar-chart/atoms/ChartLegend';
import CustomYAxisTick from '@/components/common/nested-bar-chart/atoms/CustomYAxisTick';
import TwoSideBarChartV2Tooltip from '@/components/common/positive-negative-bar-chart-v2/atoms/TwoSideBarChartV2Tooltip';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  BASE_BAR_HEIGHT,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  DEFAULT_MAX_BAR_RATIO,
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
import BarLabel from './atoms/BarLabel';
import { PositiveAndNegativeBarChartV2Props, TwoSideBarItem } from './types';

const PositiveAndNegativeBarChartV2 = ({
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
  showTotal = false,
  totalName = 'Total',
  totalColor = '#888888',
  callbackYAxis,
  expanded = true,
  header,
}: PositiveAndNegativeBarChartV2Props) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [chartHeight, setChartHeight] = useState(height);
  const { width } = useWindowSize();
  const isMobile = useIsMobile();
  const BAR_GAP = 0;
  const BAR_CATEGORY_GAP = 10;

  // Toggle expand/collapse with debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleExpand = useCallback(
    debounce((name: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [name]: !prev[name],
      }));
    }, 100),
    [],
  );

  // Calculate total item if showTotal is true
  const getTotalItem = useCallback((): TwoSideBarItem => {
    const totalPositive = data.reduce((sum, item) => sum + (item.positiveValue || 0), 0);
    const totalNegative = data.reduce((sum, item) => sum + (item.negativeValue || 0), 0);
    return {
      name: totalName,
      positiveValue: totalPositive,
      negativeValue: totalNegative,
      color: totalColor,
      type: 'total',
      depth: 0,
      isChild: false,
    };
  }, [data, totalName, totalColor]);

  // Prepare chart data with total item
  const chartData = useMemo(() => {
    if (showTotal) {
      const totalItem = getTotalItem();
      return [totalItem, ...data];
    }
    return data;
  }, [data, showTotal, getTotalItem]);

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
        const color = item.color || levelConfig?.colors[depth] || '#888888';
        const currentItem: TwoSideBarItem = {
          ...item,
          color,
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

  const visibleData = useMemo(() => buildProcessedData(chartData), [buildProcessedData, chartData]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleData]);

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
      <TwoSideBarChartV2Tooltip
        {...props}
        currency={currency}
        locale={locale}
        tutorialText={tutorialText}
        formatter={xAxisFormatter}
      />
    ),
    [currency, locale, tutorialText, xAxisFormatter],
  );

  return (
    <div className="w-full transition-colors rounded-lg py-4 duration-200">
      {header ||
        (title && (
          <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {title}
          </h2>
        ))}
      <div
        style={{ height: `${chartHeight}px` }}
        className="transition-all duration-300 flex flex-col md:flex-row"
      >
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
                  callback={callbackYAxis}
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
              label={(props) => <BarLabel {...props} formatter={xAxisFormatter} />}
              onClick={(props) => callback && callback(props.payload)}
              className="transition-all duration-300 cursor-pointer"
            >
              {visibleData.map((entry, index) => (
                <Cell key={`negative-cell-${index}`} fill={entry.color} />
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
                  callback={callbackYAxis}
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
              label={(props) => <BarLabel {...props} formatter={xAxisFormatter} />}
              onClick={(props) => callback && callback(props.payload)}
              className="transition-all duration-300 cursor-pointer"
            >
              {visibleData.map((entry, index) => (
                <Cell key={`positive-cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend items={legendItems} />
    </div>
  );
};

export default PositiveAndNegativeBarChartV2;
