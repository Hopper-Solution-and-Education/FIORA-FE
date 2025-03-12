'use client';

import type React from 'react';

import { useState, useCallback } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ChevronDown, ChevronRight } from 'lucide-react';

export type BarItem = {
  name: string;
  value: number;
  color: string;
  type: string;
  children?: BarItem[];
};

export type NestedBarChartProps = {
  data: BarItem[];
  title: string;
  height?: number;
  xAxisFormatter?: (value: number) => string;
  tooltipContent?: (item: BarItem) => React.ReactNode;
  legendItems?: { name: string; color: string }[];
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-3 rounded-md">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          {item.type}:{' '}
          <span className="font-bold">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
              item.value,
            )}
          </span>
        </p>
        {item.parent && (
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Parent: <span className="font-medium">{item.parent}</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

const NestedBarChart = ({
  data,
  title,
  height = 400,
  xAxisFormatter = (value) => value.toString(),
  tooltipContent,
  legendItems,
}: NestedBarChartProps) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = useCallback((name: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  }, []);

  // Process data to include children when expanded
  const processedData = data.reduce<any[]>((acc, item) => {
    // Add parent item
    acc.push(item);

    // Add children if expanded and children exist
    if (expandedItems[item.name] && item.children && item.children.length > 0) {
      const childrenWithParent = item.children.map((child) => ({
        ...child,
        parent: item.name,
        isChild: true,
      }));
      acc.push(...childrenWithParent);
    }

    return acc;
  }, []);

  // Create legend items if not provided
  const defaultLegendItems = [
    { name: 'Expense', color: '#EF4444' },
    { name: 'Income', color: '#10B981' },
  ];

  const chartLegendItems = legendItems || defaultLegendItems;

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>

      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 30 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              className="dark:stroke-gray-600"
              horizontal={true}
              vertical={true}
            />
            <XAxis
              type="number"
              tickFormatter={xAxisFormatter}
              className="text-sm text-gray-600 dark:text-gray-400"
            />
            <YAxis
              type="category"
              dataKey="name"
              className="text-sm text-gray-600 dark:text-gray-400"
              tickLine={false}
              axisLine={false}
              tick={(props) => {
                const { x, y, payload } = props;
                const item = processedData.find((d) => d.name === payload.value);
                const isChild = item?.isChild;

                return (
                  <g transform={`translate(${x},${y})`}>
                    {!isChild && item?.children && item.children.length > 0 && (
                      <foreignObject x="-24" y="-12" width="24" height="24">
                        <div
                          className="cursor-pointer flex items-center justify-center h-full"
                          onClick={() => toggleExpand(payload.value)}
                        >
                          {expandedItems[payload.value] ? (
                            <ChevronDown className="h-3 w-3 text-gray-800 dark:text-gray-200" />
                          ) : (
                            <ChevronRight className="h-3 w-3 text-gray-800 dark:text-gray-200" />
                          )}
                        </div>
                      </foreignObject>
                    )}
                    <text
                      x={isChild ? '-16' : '-8'}
                      y="4"
                      textAnchor="end"
                      className="text-sm fill-gray-600 dark:fill-gray-400"
                    >
                      {isChild ? `↳ ${payload.value}` : payload.value}
                    </text>
                  </g>
                );
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine x={0} stroke="#666666" className="dark:stroke-gray-500" />
            <Bar
              dataKey="value"
              radius={[4, 4, 4, 4]}
              className="transition-all duration-300"
              label={(props) => {
                const { x, y, width, height, value } = props;
                // Only show label if bar is wide enough
                if (width < 40) {
                  return <text />;
                }

                return (
                  <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`font-medium ${width > 60 ? 'text-sm' : 'text-xs'} fill-white dark:fill-white`}
                    style={{
                      filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.3))',
                      pointerEvents: 'none',
                    }}
                  >
                    {xAxisFormatter(value)}
                  </text>
                );
              }}
            >
              {processedData.map((entry, index) => {
                // Use a lighter color for child items
                const color = entry.isChild
                  ? entry.color + '80' // 50% opacity
                  : entry.color;

                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        {chartLegendItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NestedBarChart;
