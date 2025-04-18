/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import ChartLegend from '@/components/common/atoms/ChartLegend';
import CustomYAxisTick from '@/components/common/atoms/CustomYAxisTick';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import {
  BASE_BAR_HEIGHT,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  MIN_CHART_HEIGHT,
} from '@/shared/constants/chart';
import { getChartMargins, useWindowSize } from '@/shared/utils/device';
import debounce from 'lodash/debounce';
import { memo, useCallback, useMemo, useState } from 'react';
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
import BarLabel from '../BarLabel';
import CustomTooltip from '../CustomTooltip';
import { BarItem, LevelConfig, processChartData, processVisibleData } from './utils';

export type TwoSideBarChartBarChartProps = {
  data: BarItem[];
  title?: string;
  currency?: string;
  locale?: string;
  xAxisFormatter?: (value: number) => string;
  tooltipContent?: ContentType<ValueType, NameType>;
  legendItems: { name: string; color: string }[];
  maxBarRatio?: number;
  tutorialText?: string;
  callback?: (item: any) => void;
  callbackYAxis?: (item: any) => void;
  levelConfig?: LevelConfig;
};

const TwoSideBarChart = ({
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
  callbackYAxis,
  levelConfig,
}: TwoSideBarChartBarChartProps) => {
  const isMobile = useIsMobile();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const { width } = useWindowSize();

  // Handle expand/collapse with transition to avoid lag
  const toggleExpand = useCallback(
    debounce((name: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [name]: !prev[name],
      }));
    }, 100),
    [],
  );

  // Get icon for an item
  const getIcon = useCallback((item: BarItem) => {
    if (item.icon) return item.icon;
    if (!item.icon && item.product && item.product.icon) return item.product.icon;
    return null;
  }, []);

  // Process chart data
  const chartData = useMemo(() => processChartData(data, levelConfig), [data, levelConfig]);

  // Process visible data for rendering
  const visibleData = useMemo(
    () => processVisibleData(chartData, expandedItems, levelConfig, getIcon),
    [chartData, expandedItems, levelConfig, getIcon],
  );

  // Compute chart height
  const chartHeight = useMemo(() => {
    const numBars = visibleData.length;
    const newHeight = numBars * (BASE_BAR_HEIGHT + 10); // BAR_CATEGORY_GAP = 10
    return Math.max(newHeight, MIN_CHART_HEIGHT);
  }, [visibleData.length]);

  // Compute max absolute value for X-axis
  const maxAbsValue = useMemo(() => {
    const absValues = visibleData.flatMap((item) =>
      [Math.abs(item.expense || 0), Math.abs(item.income || 0)].filter((v) => v !== 0),
    );
    return Math.max(...absValues, 0) || 1;
  }, [visibleData]);

  const BAR_HEIGHT = BASE_BAR_HEIGHT;
  const BAR_GAP = 0;
  const BAR_CATEGORY_GAP = 10;

  // Compute margins
  const expenseChartMargins = useMemo(
    () => ({
      ...getChartMargins(width),
      right: 0,
      left: 40, // Space for indented labels
    }),
    [width],
  );

  const incomeChartMargins = useMemo(
    () => ({
      ...getChartMargins(width),
      left: isMobile ? 10 : 0,
    }),
    [width, isMobile],
  );

  // Memoized tooltip
  const customTooltipWithConfig = useCallback(
    (props: any) => (
      <CustomTooltip
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
      {title && (
        <h2 className="text-xl text-center font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title}
        </h2>
      )}
      <div
        style={{ height: `${chartHeight}px` }}
        className="transition-all duration-300 flex flex-col md:flex-row"
      >
        {/* Expense Chart */}
        <ResponsiveContainer width="100%" height={chartHeight} className="md:w-1/2">
          <BarChart
            data={visibleData}
            layout="vertical"
            margin={expenseChartMargins}
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
              barSize={BAR_HEIGHT}
              label={(props) => <BarLabel {...props} formatter={xAxisFormatter} />}
              onClick={(props) => callback && callback(props)}
              className="transition-all duration-300 cursor-pointer"
            >
              {visibleData.map((entry, index) => {
                const color = entry.isChild ? legendItems[2].color : legendItems[0].color;
                return <Cell key={`expense-cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Income Chart */}
        <ResponsiveContainer
          width="100%"
          height={chartHeight}
          className={`md:w-1/2 ${isMobile && 'mt-10'}`}
        >
          <BarChart
            data={visibleData}
            layout="vertical"
            margin={incomeChartMargins}
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
              dataKey="income"
              barSize={BAR_HEIGHT}
              label={(props) => <BarLabel {...props} formatter={xAxisFormatter} />}
              onClick={(props) => callback && callback(props)}
              className="transition-all duration-300 cursor-pointer"
            >
              {visibleData.map((entry, index) => {
                const color = entry.isChild ? legendItems[3].color : legendItems[1].color;
                return <Cell key={`income-cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend items={legendItems} />
    </div>
  );
};

export default memo(TwoSideBarChart);
