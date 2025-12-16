'use client';

import { BaseChartProps } from '@/shared/types';
import { memo, useMemo } from 'react';
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

interface VerticalBarChartProps extends Omit<BaseChartProps<SimpleBarItem>, 'tooltipContent'> {
  tooltipContent?: (props: any) => React.ReactNode;
  onBarClick?: (item: SimpleBarItem, index: number) => void;
}

const VerticalBarChart = ({
  data,
  height = 300,
  yAxisFormatter = (value) => value.toLocaleString(),
  tooltipContent,
  onBarClick,
  sortEnable = true,
}: VerticalBarChartProps) => {
  // Sort data if sortEnable is true (highest values first)
  const sortedData = useMemo(
    () => sortChartData(data, sortEnable, sortByValue),
    [data, sortEnable],
  );

  const maxValue = Math.max(...sortedData.map((item) => item.value));

  // Default tooltip content
  const defaultTooltipContent = (props: any) => {
    const { active, payload, label } = props;
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg transition-colors duration-200">
        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{label}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Amount: <span className="font-semibold">{yAxisFormatter(payload[0].value)} FX</span>
        </p>
      </div>
    );
  };

  return (
    <div style={{ height: `${height + 120}px` }}>
      <ResponsiveContainer width="100%" height={height + 120}>
        <BarChart
          data={sortedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          barCategoryGap={15}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:stroke-gray-600" />
          <XAxis
            dataKey="name"
            className="text-sm text-gray-600 dark:text-gray-400"
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            type="number"
            domain={[0, maxValue]}
            tickFormatter={yAxisFormatter}
            className="text-sm text-gray-600 dark:text-gray-400"
            tickLine={false}
            axisLine={false}
            tickCount={7}
            interval={0}
          />
          <Tooltip trigger="hover" content={tooltipContent || defaultTooltipContent} />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            className="cursor-pointer"
            onClick={(data, index) => onBarClick && onBarClick(data, index)}
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default memo(VerticalBarChart);
