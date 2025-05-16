'use client';

import { memo, useMemo, useCallback } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ComposedChartProps, TooltipProps, ColumnConfig, LineConfig } from './type';
import { cn, formatCurrency } from '@/shared/utils';
import { getChartMargins, useWindowSize } from '@/shared/utils/device';
import { ChartSkeleton } from '@/components/common/organisms';
import { DEFAULT_CURRENCY } from '@/shared/constants/chart';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';
import {
  DEFAULT_COMPOSED_CHART_FONT_SIZE,
  DEFAULT_COMPOSED_CHART_HEIGHT,
  DEFAULT_COMPOSED_CHART_TICK_COUNT,
} from './constant';

const ComposedChartComponent = ({
  data = [],
  title,
  currency = DEFAULT_CURRENCY,
  isLoading = false,
  callback,
  className,
  xAxisFormatter = (value: number) => value.toString(),
  yAxisFormatter = (value: number) => formatCurrency(value, currency),
  columns,
  lines,
  showLegend = true,
  height = DEFAULT_COMPOSED_CHART_HEIGHT,
  fontSize = DEFAULT_COMPOSED_CHART_FONT_SIZE,
  tickCount = DEFAULT_COMPOSED_CHART_TICK_COUNT,
}: ComposedChartProps) => {
  const { width } = useWindowSize();
  const chartMargins = useMemo(() => getChartMargins(width), [width]);

  const renderTooltipContent = (props: TooltipProps) => {
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

        {payload.map((entry: Payload<number, string>, index: number) => (
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
  };

  const renderCustomLegend = () => (
    <div className="flex justify-center items-center gap-4 mt-4">
      {columns.map((column, index) => (
        <div key={`legend-column-${index}`} className="flex items-center">
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: column.color }} />
          <span className="text-sm text-gray-600 dark:text-gray-400">{column.name}</span>
        </div>
      ))}
      {lines.map((line, index) => (
        <div key={`legend-line-${index}`} className="flex items-center">
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: line.color }} />
          <span className="text-sm text-gray-600 dark:text-gray-400">{line.name}</span>
        </div>
      ))}
    </div>
  );

  const handleChartClick = useCallback(
    (data: any) => {
      if (callback && data && data.activePayload) {
        callback(data.activePayload[0].payload);
      }
    },
    [callback],
  );

  if (isLoading) {
    return <ChartSkeleton />;
  }

  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200',
        className,
      )}
    >
      {title && (
        <div className="flex justify-start items-center gap-4 p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
        </div>
      )}

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={chartMargins} onClick={handleChartClick}>
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
          />
          <YAxis
            tickFormatter={yAxisFormatter}
            tick={{ fill: 'gray', fontSize: fontSize.axis }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            domain={['auto', 'auto']}
            padding={{ top: 40 }}
            tickCount={tickCount}
          />
          <Tooltip content={renderTooltipContent} />
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
              barSize={40}
              radius={[4, 4, 0, 0]}
              animationDuration={400}
              animationEasing="ease-out"
              activeBar={{
                fill: column.color,
                stroke: '#ffffff',
                strokeWidth: 2,
                filter: 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.3))',
                cursor: 'pointer',
                strokeOpacity: 0.8,
              }}
            />
          ))}

          {lines.map((line: LineConfig, index: number) => (
            <Line
              key={`line-${index}`}
              type="monotone"
              dataKey={line.key}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 5, fill: line.color, strokeWidth: 1, stroke: '#ffffff' }}
              activeDot={{
                r: 8,
                stroke: '#ffffff',
                strokeWidth: 2,
                fill: line.color,
                filter: 'drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.3))',
              }}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>

      {!showLegend && renderCustomLegend()}
    </div>
  );
};

export default memo(ComposedChartComponent);
