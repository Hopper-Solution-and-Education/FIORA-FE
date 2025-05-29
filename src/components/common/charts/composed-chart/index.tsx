'use client';

import { memo, useMemo, useCallback } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import { ComposedChartProps } from './type';
import { cn, formatCurrency } from '@/shared/utils';
import { findMaxMinValues } from '@/shared/utils/chart';
import { getChartMargins, useWindowSize } from '@/shared/utils/device';
import { ChartSkeleton } from '@/components/common/organisms';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import {
  DEFAULT_CHART_FONT_SIZE,
  DEFAULT_CHART_TICK_COUNT,
  DEFAULT_CURRENCY,
} from '@/shared/constants/chart';
import { Payload } from 'recharts/types/component/DefaultTooltipContent';
import { DEFAULT_COMPOSED_CHART_HEIGHT, DEFAULT_COMPOSED_CHART_ITEM_WIDTH } from './constant';
import { ColumnConfig, LineConfig, TooltipProps } from '@/shared/types/chart.type';
import { ChartLegend } from '@/components/common/atoms';

const ComposedChartComponent = ({
  data = [],
  title,
  callback,
  className,
  columns,
  lines,
  yAxisFormatter = (value: number) => formatCurrency(value, currency),
  isLoading = false,
  showLegend = true,
  currency = DEFAULT_CURRENCY,
  height = DEFAULT_COMPOSED_CHART_HEIGHT,
  fontSize = DEFAULT_CHART_FONT_SIZE,
  tickCount = DEFAULT_CHART_TICK_COUNT,
}: ComposedChartProps) => {
  const { width } = useWindowSize();
  const isMobile = useIsMobile();
  const chartMargins = useMemo(() => getChartMargins(width), [width]);

  const labelsDistance = useMemo(() => {
    const availableWidth = width - (chartMargins.left + chartMargins.right);
    const averageWidth = availableWidth / data.length;
    return {
      shouldRotateLabels: averageWidth < 250,
      shouldTruncate: averageWidth < 300,
      averageWidth,
    };
  }, [width, chartMargins, data.length]);

  const legendItems = useMemo(() => {
    const items = [
      ...columns.map((col) => ({
        name: col.name,
        color: col.color,
      })),
      ...(lines?.map((line) => ({
        name: line.name,
        color: line.color,
      })) || []),
    ];
    return items;
  }, [columns, lines]);

  const { maxValue, minValue } = useMemo(() => {
    const columnsMaxMin = findMaxMinValues(data, columns);

    let linesMax = 0;
    let linesMin = 0;

    if (lines && lines.length > 0) {
      data.forEach((item) => {
        lines.forEach((line) => {
          const value = item[line.key] as number;
          if (value > 0 && value > linesMax) linesMax = value;
          if (value < 0 && value < linesMin) linesMin = value;
        });
      });
    }

    const finalMax = Math.max(columnsMaxMin.maxValue, linesMax);
    const finalMin = Math.min(columnsMaxMin.minValue, linesMin);

    return { maxValue: finalMax, minValue: finalMin };
  }, [data, columns, lines]);

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

      {isMobile && showLegend && <ChartLegend items={legendItems} />}

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ ...chartMargins, top: 20 }} onClick={handleChartClick}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
            className="dark:stroke-gray-600 transition-colors duration-200"
          />
          <XAxis
            dataKey="name"
            tickFormatter={(value) => {
              if (labelsDistance.shouldRotateLabels) {
                return value.length > 12 ? value.substring(0, 12) + '...' : value;
              }

              if (value.length > 25 || labelsDistance.shouldTruncate) {
                return value.length > 15 ? value.substring(0, 15) + '...' : value;
              }

              return value;
            }}
            tick={{
              fill: 'gray',
              fontSize: fontSize.axis,
              textAnchor: labelsDistance.shouldRotateLabels ? 'end' : 'middle',
            }}
            angle={labelsDistance.shouldRotateLabels ? -40 : 0}
            height={labelsDistance.shouldRotateLabels ? 60 : 30}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            interval={0}
          />
          <YAxis
            tickFormatter={yAxisFormatter}
            tick={{ fill: 'gray', fontSize: fontSize.axis }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
            domain={[minValue, maxValue]}
            tickCount={tickCount}
          />
          <ReferenceLine y={0} stroke="#E5E7EB" className="dark:stroke-gray-600" />
          <Tooltip
            cursor={{
              strokeWidth: 1,
              strokeDasharray: '4 4',
              className: 'dark:fill-gray-100 dark:stroke-gray-600 transition-all duration-300',
            }}
            content={renderTooltipContent}
          />

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
                fill: `${column.color}`,
                stroke: '#ffffff',
                strokeWidth: 2,
                filter: 'brightness(1.1) drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25))',
                cursor: 'pointer',
              }}
              maxBarSize={DEFAULT_COMPOSED_CHART_ITEM_WIDTH}
            />
          ))}

          {lines &&
            lines.map((line: LineConfig, index: number) => (
              <Line
                key={`line-${index}`}
                type="monotone"
                dataKey={line.key}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                dot={{
                  r: 4,
                  fill: line.color,
                  strokeWidth: 1,
                  stroke: '#ffffff',
                }}
                activeDot={{
                  r: 6,
                  stroke: '#ffffff',
                  strokeWidth: 2,
                  fill: line.color,
                  filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.25))',
                }}
              />
            ))}
        </ComposedChart>
      </ResponsiveContainer>

      {!isMobile && showLegend && <ChartLegend items={legendItems} />}
    </div>
  );
};

export default memo(ComposedChartComponent);
