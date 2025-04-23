'use client';

import { BarLabel, ChartLegend } from '@/components/common/atoms';
import StackYAxisTick from '@/components/common/atoms/StackYAxisTick';
import { BASE_BAR_HEIGHT, DEFAULT_CURRENCY, MIN_CHART_HEIGHT } from '@/shared/constants/chart';
import { cn, formatCurrency } from '@/shared/utils';
import { getChartMargins, useWindowSize } from '@/shared/utils/device';
import { memo, useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { StackedBarProps, TooltipProps } from './type';

const StackedBarChart = ({
  data = [],
  title,
  currency = DEFAULT_CURRENCY,
  onItemClick,
  className,
  xAxisFormatter = (value) => value.toString(),
  tutorialText,
  legendItems,
}: StackedBarProps) => {
  const [chartHeight, setChartHeight] = useState(MIN_CHART_HEIGHT);
  const { width } = useWindowSize();
  const chartMargins = useMemo(() => getChartMargins(width), [width]);

  const formatter = (key: string, value: number): string => {
    return `${key}: ${formatCurrency(value, currency)}`;
  };

  const renderTooltipContent = (props: TooltipProps) => {
    const { active, payload, label } = props;
    if (!active || !payload || !payload.length) return null;

    const item = data.find((item) => item.name === label);
    if (!item) return null;

    return (
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {payload.map((entry, index: number) => {
          if (!entry.value) return null;
          const layerId = entry.dataKey as string;
          return (
            <div
              key={index}
              className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1"
            >
              <div
                className="w-3 h-3 mr-2 rounded-sm"
                style={{ backgroundColor: item.colors[layerId as any] }}
              />
              <span>{layerId}:</span>
              <span className="font-bold ml-1">{formatCurrency(entry.value, currency)}</span>
            </div>
          );
        })}
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
          Total:{' '}
          <span className="font-bold">
            {formatCurrency(
              payload.reduce((sum: number, entry) => sum + (entry.value || 0), 0),
              currency,
            )}
          </span>
        </p>
        {tutorialText && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{tutorialText}</p>
        )}
      </div>
    );
  };

  // Custom label renderer for T, B, R
  const renderCustomLabel = (data: any, props: any) => {
    const { x, y, width, height, index } = props;
    const entry = data[index];
    const T = entry['T'];
    const B = entry['B'];
    const A = entry['A'];
    const R = T - A;

    // Position the label at the end of the bar
    const labelX = x + width + 10; // Offset by 10px to the right
    const labelY = y + height / 2 - 5;

    return (
      <g>
        <text
          x={labelX}
          y={labelY}
          fill="#666"
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={12}
        >
          T: {formatCurrency(T, currency)} → B: {formatCurrency(B, currency)}
        </text>
        <text
          x={labelX}
          y={labelY + 15} // Offset for the next line
          fill="#666"
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={12}
        >
          R: {formatCurrency(R, currency)}
        </text>
      </g>
    );
  };

  // Dynamic Chart Height
  useEffect(() => {
    const numBars = data.length;
    const newHeight = Math.max(numBars * BASE_BAR_HEIGHT, MIN_CHART_HEIGHT);
    setChartHeight(newHeight);
  }, [data]);

  return (
    <div
      className={cn(
        'w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200',
        className,
      )}
    >
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{title}</h2>
        </div>
      )}
      <div style={{ height: `${chartHeight}px` }} className="transition-all duration-300">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ ...chartMargins, left: 0, right: 150 }} // Increased right margin for labels
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
                <StackYAxisTick {...props} processedData={data} callback={onItemClick} />
              )}
            />
            <Tooltip content={renderTooltipContent} />
            {['A', 'T', 'B'].map((key) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                label={(props) => (
                  <BarLabel
                    {...props}
                    fontSize="text-xs"
                    renderValue={formatter(key, props.value)}
                  />
                )}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.colors[key as any] || '#cccccc'} />
                ))}
                {key === 'B' && (
                  <LabelList
                    dataKey={key}
                    content={(props) => renderCustomLabel(data, props)}
                    position="right"
                  />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartLegend items={legendItems || []} />
    </div>
  );
};

export default memo(StackedBarChart);
