'use client';

import { BarLabel, ChartLegend } from '@/components/common/atoms';
import StackYAxisTick from '@/components/common/atoms/StackYAxisTick';
import {
  BASE_BAR_HEIGHT,
  COLORS,
  DEFAULT_CURRENCY,
  MIN_CHART_HEIGHT,
  STACK_TYPE,
} from '@/shared/constants/chart';
import { cn, formatCurrency } from '@/shared/utils';
import { getChartMargins, useWindowSize } from '@/shared/utils/device';
import React, { memo, useEffect, useMemo, useState } from 'react';
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
import { CustomBarItem, StackBarDisplay, StackedBarProps, TooltipProps } from './type';

const largestKey = (item: CustomBarItem): string => {
  const largestValue = Math.max(item.A, item.B, item.T);
  return largestValue === item.A ? 'A' : largestValue === item.B ? 'B' : 'T';
};

const calculateDisplayValues = (data: CustomBarItem[]): StackBarDisplay[] => {
  return data.map((item) => {
    const displayA = item.A;
    const displayT = item.T - item.A;
    const displayB = item.B - item.T;
    return {
      ...item,
      A: displayA,
      T: displayT > displayA ? displayT : 0,
      B: displayB > displayT ? displayB : 0,
      AOriginalValue: item.A,
      BOriginalValue: item.B,
      TOriginalValue: item.T,
      maxKey: largestKey(item),
    };
  });
};

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

  const processedData = useMemo(() => calculateDisplayValues(data), [data]);

  const formatter = (key: string, value: number): string => {
    return `${key}: ${formatCurrency(value, currency)}`;
  };

  const calculateRValue = (item: StackBarDisplay): number => {
    let R: number = 0;
    switch (item.type) {
      case STACK_TYPE.EXPENSE:
        R = item.BOriginalValue - item.AOriginalValue;
        break;
      case STACK_TYPE.INCOME:
        R = item.AOriginalValue - item.BOriginalValue;
        break;
      case STACK_TYPE.PROFIT:
        R = item.AOriginalValue - item.BOriginalValue;
        break;
      default:
        break;
    }
    return R;
  };

  const renderTooltipContent = (props: TooltipProps) => {
    const { active, payload, label } = props;
    if (!active || !payload || !payload.length) return null;

    const item = data.find((item) => item.name === label);
    if (!item) return null;

    return (
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
        {/* A ZONE */}
        <div
          key={item.A}
          className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1"
        >
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: item.colors.A }} />
          <span>A:</span>
          <span className="font-bold ml-1">{formatCurrency(item.A, currency)}</span>
        </div>
        {/* T ZONE */}
        <div
          key={item.T}
          className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1"
        >
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: item.colors.T }} />
          <span>T:</span>
          <span className="font-bold ml-1">{formatCurrency(item.T, currency)}</span>
        </div>
        {/* B ZONE */}
        <div
          key={item.B}
          className="flex items-center text-xs text-gray-600 dark:text-gray-400 mt-1"
        >
          <div className="w-3 h-3 mr-2 rounded-sm" style={{ backgroundColor: item.colors.B }} />
          <span>B:</span>
          <span className="font-bold ml-1">{formatCurrency(item.B, currency)}</span>
        </div>
        {tutorialText && (
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">{tutorialText}</p>
        )}
      </div>
    );
  };

  // Custom label renderer for T, B, R
  const renderCustomLabel = (data: StackBarDisplay[], props: any, dataKey: string) => {
    const { x, y, width, height, index } = props;
    const entry = data[index];

    if (dataKey !== entry.maxKey) return null;

    const R = calculateRValue(entry);

    const labelX = x + width + 10;
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
          fontWeight={600}
        >
          T: {formatCurrency(entry.TOriginalValue, currency)} → B:{' '}
          {formatCurrency(entry.BOriginalValue, currency)}
        </text>
        <text
          x={labelX}
          y={labelY + 15}
          fill={R >= 0 ? COLORS.DEPS_INFO.LEVEL_1 : COLORS.DEPS_DANGER.LEVEL_1}
          textAnchor="start"
          dominantBaseline="middle"
          fontSize={12}
          fontWeight={600}
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
            data={processedData}
            layout="vertical"
            margin={{ ...chartMargins, left: 0, right: 150 }}
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
                {processedData.map((entry, index) => (
                  <Cell key={index} fill={entry.colors[key as keyof typeof entry.colors]} />
                ))}
                <LabelList
                  dataKey={key}
                  content={(props) => renderCustomLabel(processedData, props, key)}
                  position="right"
                />
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
