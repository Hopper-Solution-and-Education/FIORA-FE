'use client';

import React from 'react';
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
import { useTheme } from 'next-themes';

interface ChildChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

interface ChildVerticalChartProps {
  data: ChildChartData[];
  parentColor: string;
  xAxisFormatter: (value: number) => string;
  tooltipContent?: React.ComponentType<any>;
}

const ChildVerticalChart: React.FC<ChildVerticalChartProps> = ({
  data,
  parentColor,
  xAxisFormatter,
  tooltipContent: TooltipContent,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={data.length * 40}>
      {/* Dynamic height */}
      <BarChart data={data} layout="vertical" margin={{ top: 0, bottom: 0, right: 20, left: 20 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal
          vertical={false}
          stroke={isDarkMode ? '#4B5563' : '#E5E7EB'}
        />
        <XAxis
          type="number"
          tickFormatter={xAxisFormatter}
          tick={{ fontSize: 12, fill: isDarkMode ? '#D1D5DB' : '#4B5563' }}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={130} // Slightly less than parent to indicate nesting
          tickLine={false}
          tickFormatter={(value) => value}
          tick={{
            fontSize: 12,
            fill: isDarkMode ? '#D1D5DB' : '#4B5563',
          }}
        />
        {TooltipContent && <Tooltip content={<TooltipContent />} />}
        <Bar
          dataKey="value"
          radius={[4, 4, 4, 4]}
          label={({ x, y, height, value }) => {
            const xPos = x + 20;
            return (
              <text
                x={xPos}
                y={y + height / 2}
                fill={isDarkMode ? '#FFFFFF' : '#000000'}
                fontSize={12}
                fontWeight={500}
                dominantBaseline="middle"
              >
                {xAxisFormatter(value)}
              </text>
            );
          }}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={`${parentColor}80`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ChildVerticalChart;
