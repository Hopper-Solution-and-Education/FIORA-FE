'use client';

import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useTheme } from 'next-themes';
import ChildVerticalChart from './ChildVerticalChart'; // Adjust path
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/Icon';

interface ChartData {
  name: string;
  value: number;
  color: string;
  children?: ChartData[];
  [key: string]: any;
}

export interface GlobalVerticalChartProps {
  data: ChartData[];
  title: string;
  height?: number;
  xAxisFormatter?: (value: number) => string;
  yAxisKey?: string;
  valueKey?: string;
  tooltipContent?: React.ComponentType<any>;
  legendItems?: { label: string; color: string }[];
}

const GlobalVerticalChart: React.FC<GlobalVerticalChartProps> = ({
  data,
  title,
  height = 600,
  xAxisFormatter = (value) => value.toString(),
  yAxisKey = 'name',
  valueKey = 'value',
  tooltipContent: TooltipContent,
  legendItems,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpand = (name: string) => {
    setExpanded((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(name)) {
        newExpanded.delete(name);
      } else {
        newExpanded.add(name);
      }
      return newExpanded;
    });
  };

  // Dynamic height calculation
  const totalHeight = data.reduce((acc, item) => {
    const childCount = expanded.has(item.name) && item.children ? item.children.length : 0;
    return acc + 40 + childCount * 40; // 40px per bar
  }, 0);

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>

      <ResponsiveContainer width="100%" height={Math.max(height, totalHeight)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, bottom: 40, right: 20, left: 20 }}
        >
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
            dataKey={yAxisKey}
            width={150}
            tickLine={false}
            tickFormatter={(value) => value}
            // tick={{
            //   fontSize: 12,
            //   fill: isDarkMode ? '#D1D5DB' : '#4B5563',
            // }}
            tick={({ x, y, payload }) => {
              const item = data.find((d) => d[yAxisKey] === payload.value);
              const hasChildren = item?.children && item.children.length > 0;
              console.log('hasChildren', hasChildren);
              return (
                <g transform={`translate(${x},${y})`}>
                  {hasChildren && (
                    <text
                      x={-20}
                      y={0}
                      fill={isDarkMode ? '#FFFFFF' : '#000000'}
                      fontSize={12}
                      textAnchor="end"
                      dominantBaseline="middle"
                      style={{ cursor: 'pointer' }}
                    >
                      {/* {expanded.has(payload.value) ? '▼' : '▶'} */}
                      <Button variant="outline" size="icon">
                        {expanded.has(payload.value) ? (
                          <Icons.chevronRight onClick={() => toggleExpand(payload.value)} />
                        ) : (
                          <Icons.chevronDown onClick={() => toggleExpand(payload.value)} />
                        )}
                      </Button>
                    </text>
                  )}
                  <text
                    x={0}
                    y={0}
                    fill={isDarkMode ? '#D1D5DB' : '#4B5563'}
                    fontSize={12}
                    textAnchor="end"
                    dominantBaseline="middle"
                  >
                    {payload.value}
                  </text>
                </g>
              );
            }}
          />
          {TooltipContent && <Tooltip content={<TooltipContent />} />}
          <ReferenceLine x={0} stroke={isDarkMode ? '#6B7280' : '#666'} />
          <Bar
            dataKey={valueKey}
            radius={[4, 4, 4, 4]}
            label={({ x, y, height, value, index }) => {
              const item = data[index!];
              const xPos = x + 20;
              return (
                <g>
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
                  {expanded.has(item[yAxisKey]) && item.children && (
                    <foreignObject
                      x={0}
                      y={y + height}
                      width="100%"
                      height={item.children.length * 40}
                    >
                      <ChildVerticalChart
                        data={item.children.map((child) => ({
                          ...child,
                          name: `  ${child.name}`, // Indent child names
                        }))}
                        parentColor={item.color}
                        xAxisFormatter={xAxisFormatter}
                        tooltipContent={TooltipContent}
                      />
                    </foreignObject>
                  )}
                </g>
              );
            }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {legendItems && (
        <div className="mt-4 flex gap-4">
          {legendItems.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalVerticalChart;
