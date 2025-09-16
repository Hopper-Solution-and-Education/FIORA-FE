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

interface SimpleBarItem {
  name: string;
  value: number;
  color: string;
}

interface HorizontalBarChartProps {
  data: SimpleBarItem[];
  height?: number;
  xAxisFormatter?: (value: number) => string;
  tooltipContent?: (props: any) => React.ReactNode;
}

const HorizontalBarChart = ({
  data,
  height = 280,
  xAxisFormatter = (value) => value.toLocaleString(),
  tooltipContent,
}: HorizontalBarChartProps) => {
  const maxValue = Math.max(...data.map((item) => item.value));

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
        fill="#374151"
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
          data={data}
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
                    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-semibold text-gray-800 mb-1">
                        {props.payload[0].payload.name}
                      </p>
                      <p className="text-sm text-gray-600">Value: {xAxisFormatter(value)}</p>
                    </div>
                  );
                }
                return null;
              })
            }
          />
          <Bar radius={[0, 4, 4, 0]} dataKey="value" className="cursor-pointer">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HorizontalBarChart;
