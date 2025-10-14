'use client';

import React, { useState, useCallback, useMemo } from 'react';
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
import {
  ChartLegend,
  CustomTooltip,
  CustomYAxisTick,
  PositiveAndNegativeBarLabel,
} from '@/components/common/atoms';
import { useWindowSize } from '@/shared/utils/device';
import { debounce } from 'lodash';
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/shared/constants/chart';
import { sortByAbsoluteValue, sortChartData } from '../utils/sortChartData';
import { processChartData } from './utils';
import { PositiveAndNegativeBarChartProps } from './type';

const PositiveAndNegativeBarChart = ({
  data,
  title,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
  xAxisFormatter,
  tooltipContent,
  legendItems,
  callback,
  levelConfig,
  height,
  baseBarHeight,
  expanded,
  header,
  sortEnable = true,
}: PositiveAndNegativeBarChartProps) => {
  const { width } = useWindowSize();
  const totalName = levelConfig?.totalName || 'Net Total';

  // Sort data if sortEnable is true (highest values first - top to bottom for horizontal chart)
  const sortedData = useMemo(
    () => sortChartData(data, sortEnable, sortByAbsoluteValue),
    [data, sortEnable],
  );

  // Manage expanded items state
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    [totalName]: expanded ?? true,
  });

  // Debounced toggle expand function
  const toggleExpand = useCallback(
    debounce((name: string) => {
      setExpandedItems((prev) => ({
        ...prev,
        [name]: !prev[name],
      }));
    }, 100),
    [],
  );

  // Process chart data
  const { processedData, chartHeight, chartMargins, maxValue, minValue } = processChartData({
    data: sortedData,
    width,
    levelConfig,
    height,
    baseBarHeight,
    expandedItems,
  });

  // Custom tooltip
  const customTooltipWithConfig = (props: any) => (
    <CustomTooltip {...props} currency={currency} locale={locale} />
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
              domain={[minValue, maxValue]}
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
              radius={[0, 4, 4, 0]}
              dataKey="value"
              className="transition-all duration-300 cursor-pointer"
              activeBar={{
                stroke: '#ffffff',
                strokeWidth: 2,
                filter: 'brightness(1.1) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25))',
                cursor: 'pointer',
              }}
              label={(props) => (
                <PositiveAndNegativeBarLabel {...props} formatter={xAxisFormatter} />
              )}
              onClick={(props) => callback?.(props)}
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
