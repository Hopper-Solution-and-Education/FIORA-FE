'use client';

import { BaseChartProps } from '@/shared/types';
import { useMemo } from 'react';
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
import { sortByValue, sortChartData } from '../utils/sortChartData';

interface SimpleBarItem {
  name: string;
  value: number;
  color: string;
}

interface HorizontalBarChartProps extends Omit<BaseChartProps<SimpleBarItem>, 'tooltipContent'> {
  onBarClick?: (item: SimpleBarItem, index: number) => void;
  tooltipContent?: (payload: any) => React.ReactNode;
}

const HorizontalBarChart = ({
  data,
  height = 280,
  xAxisFormatter = (value) => value.toLocaleString(),
  tooltipContent,
  onBarClick,
  sortEnable = true,
}: HorizontalBarChartProps) => {
  // Sort data if sortEnable is true (highest values first - top to bottom)
  const sortedData = useMemo(
    () => sortChartData(data, sortEnable, sortByValue),
    [data, sortEnable],
  );

  const maxValue = Math.max(...sortedData.map((item) => item.value));

  // Custom Y-axis tick component to prevent text wrapping
  const CustomYAxisTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <text
        x={x - 10}
        y={y}
        textAnchor="end"
        dominantBaseline="middle"
        fontSize="14"
        className="fill-gray-600 dark:fill-gray-400"
        style={{ whiteSpace: 'nowrap' }}
      >
        {payload.value}
      </text>
    );
  };

  return (
    <div style={{ height: `${height}px` }}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={sortedData}
          layout="vertical"
          margin={{ top: 30, right: 40, left: 20, bottom: 30 }}
          barCategoryGap={15}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-600" />
          <XAxis
            type="number"
            domain={[0, maxValue]}
            tickFormatter={xAxisFormatter}
            className="text-sm text-gray-600 dark:text-gray-400"
          />
          <YAxis
            type="category"
            dataKey="name"
            className="text-sm text-gray-600 dark:text-gray-400"
            tickLine={false}
            axisLine={false}
            width={160}
            tick={<CustomYAxisTick />}
          />
          <Tooltip
            trigger="hover"
            content={
              tooltipContent ||
              ((props) => {
                if (props.active && props.payload && props.payload[0]) {
                  const value = props.payload[0].value as number;
                  return (
                    <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg transition-colors duration-200">
                      <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        {props.payload[0].payload.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Value: {xAxisFormatter(value)}
                      </p>
                    </div>
                  );
                }
                return null;
              })
            }
          />
          <Bar radius={[0, 4, 4, 0]} dataKey="value" className="cursor-pointer">
            {sortedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                onClick={() => onBarClick?.(entry, index)}
                style={{ cursor: onBarClick ? 'pointer' : 'default' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalBarChart;
