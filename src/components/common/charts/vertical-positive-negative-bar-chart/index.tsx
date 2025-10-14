'use client';

import { ChartLegend } from '@/components/common/atoms';
import { ChartSkeleton } from '@/components/common/organisms';
import {
  DEFAULT_CHART_FONT_SIZE,
  DEFAULT_CHART_TICK_COUNT,
  DEFAULT_CURRENCY,
} from '@/shared/constants/chart';
import { useCurrencyFormatter } from '@/shared/hooks';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { ColumnConfig, TooltipProps } from '@/shared/types/chart.type';
import { cn } from '@/shared/utils';
import { buildResponsiveBarCategoryGap, findMaxMinValues } from '@/shared/utils/chart';
import { getChartMargins, useWindowSize } from '@/shared/utils/device';
import { memo, useCallback, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { sortByFirstColumnAbsolute, sortChartData } from '../utils/sortChartData';
import { renderCustomLegend } from './components/VerticalPositiveNegativeBarChartLegend';
import {
  DEFAULT_VERTICAL_BAR_CHART_HEIGHT,
  DEFAULT_VERTICAL_BAR_CHART_ITEM_WIDTH,
} from './constant';
import { VerticalPositiveNegativeBarChartProps } from './types';

const VerticalPositiveNegativeBarChart = (props: VerticalPositiveNegativeBarChartProps) => {
  const { width } = useWindowSize();
  const isMobile = useIsMobile();
  const { formatCurrency } = useCurrencyFormatter();

  const {
    data = [],
    title,
    tooltipContent,
    columns,
    showLegend = true,
    isLoading = false,
    xAxisFormatter = (value: number) => value.toString(),
    yAxisFormatter = (value: number) => formatCurrency(value, currency),
    currency = DEFAULT_CURRENCY,
    height = DEFAULT_VERTICAL_BAR_CHART_HEIGHT,
    fontSize = DEFAULT_CHART_FONT_SIZE,
    tickCount = DEFAULT_CHART_TICK_COUNT,
    sortEnable = true,
  } = props;

  const chartMargins = useMemo(() => getChartMargins(width), [width]);

  // Sort data if sortEnable is true (highest values first for vertical chart)
  const sortedData = useMemo(
    () => sortChartData(data, sortEnable, (d) => sortByFirstColumnAbsolute(d, columns)),
    [data, sortEnable, columns],
  );

  const { maxValue, minValue } = useMemo(
    () => findMaxMinValues(sortedData, columns),
    [sortedData, columns],
  );

  const renderTooltipContent = useCallback(
    (props: TooltipProps) => {
      if (tooltipContent) {
        return tooltipContent;
      }
      const { active, payload, label } = props;
      if (!active || !payload || !payload.length) return null;

      return (
        <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
          <p
            className="text-sm font-medium text-gray-800 dark:text-gray-200"
            style={{ fontSize: fontSize.tooltip }}
          >
            {label}
          </p>

          {payload.map((entry, index) => (
            <div
              key={index}
              className="flex items-center text-gray-600 dark:text-gray-400 mt-1"
              style={{ fontSize: (fontSize.tooltip as number) - 2 }}
            >
              <div
                className="w-3 h-3 mr-2 rounded-sm"
                style={{ backgroundColor: entry.color || '#cccccc' }}
              />
              <span>{entry.name}:</span>
              <span className="font-bold ml-1">{yAxisFormatter(entry.value as number)}</span>
            </div>
          ))}
        </div>
      );
    },
    [tooltipContent, yAxisFormatter, fontSize],
  );

  const barCategoryGap = useMemo(
    () =>
      buildResponsiveBarCategoryGap(sortedData, {
        thresholds: {
          2: '35%',
          5: '20%',
          10: '10%',
          Infinity: '0%',
        },
      }),
    [sortedData],
  );

  if (isLoading) return <ChartSkeleton />;

  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200',
      )}
    >
      {title && (
        <div className="flex justify-start items-center gap-4 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={sortedData}
          margin={chartMargins}
          barGap={2}
          barCategoryGap={barCategoryGap}
          maxBarSize={DEFAULT_VERTICAL_BAR_CHART_ITEM_WIDTH}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
            className="dark:stroke-gray-600 transition-colors duration-200"
          />
          <XAxis
            dataKey="name"
            tickFormatter={xAxisFormatter}
            tick={{ fill: 'gray', fontSize: fontSize.axis }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            domain={['auto', 'auto']}
          />
          <YAxis
            tickFormatter={yAxisFormatter}
            tick={{ fill: 'gray', fontSize: fontSize.axis }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            domain={[minValue, maxValue]}
            tickCount={tickCount}
          />
          <Tooltip content={renderTooltipContent} cursor={false} trigger="hover" />
          <ReferenceLine y={0} stroke="#E5E7EB" className="dark:stroke-gray-600" />

          {showLegend && (
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: '20px', fontSize: fontSize.legend }}
            />
          )}

          {columns.map((column: ColumnConfig, index: number) => (
            <Bar
              key={`bar-${index}`}
              dataKey={column.key}
              name={column.name}
              fill={column.color}
              radius={[4, 4, 0, 0]}
              animationDuration={400}
              animationEasing="ease-out"
              activeBar={{
                fill: column.color,
                className:
                  'stroke-gray-400 dark:stroke-white stroke-[2px] stroke-opacity-80 hover:brightness-120 transition-all duration-200',
              }}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {!showLegend && renderCustomLegend({ columns })}
      {isMobile && (
        <ChartLegend items={columns.map((col) => ({ name: col.name, color: col.color }))} />
      )}
    </div>
  );
};

export default memo(VerticalPositiveNegativeBarChart);
