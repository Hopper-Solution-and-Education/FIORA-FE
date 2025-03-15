'use client';

import type React from 'react';
import { useState, useCallback, useMemo } from 'react';
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
import { ContentType } from 'recharts/types/component/Tooltip';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

// Types
export type BarItem = {
  name: string;
  value: number;
  color: string;
  type: string;
  parent?: string;
  children?: BarItem[];
  isChild?: boolean;
};

export type NestedBarChartProps = {
  data: BarItem[];
  title: string;
  height?: number;
  currency?: string;
  locale?: string;
  xAxisFormatter?: (value: number) => string;
  tooltipContent?: ContentType<ValueType, NameType>;
  legendItems?: { name: string; color: string }[];
  childOpacity?: number;
  maxBarRatio?: number; // Maximum ratio of chart width for the largest bar
};

// Constants
const DEFAULT_HEIGHT = 400;
const DEFAULT_LOCALE = 'vi-VN';
const DEFAULT_CURRENCY = 'VND';
const DEFAULT_CHILD_OPACITY = 0.5;
const DEFAULT_MAX_BAR_RATIO = 0.9; // 90% of chart width for largest bar
const CHART_MARGINS = { top: 10, right: 30, left: 100, bottom: 30 };

// Custom tooltip component
const CustomTooltip = ({
  active,
  payload,
  label,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
}: any) => {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload;

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm p-3 rounded-md">
      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.name}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        {item.type}:{' '}
        <span className="font-bold">
          {new Intl.NumberFormat(locale, { style: 'currency', currency }).format(item.value)}
        </span>
      </p>
      {item.parent && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Parent: <span className="font-medium">{item.parent}</span>
        </p>
      )}
    </div>
  );
};

// Tick component for Y-Axis
const CustomYAxisTick = ({ x, y, payload, processedData, expandedItems, onToggleExpand }: any) => {
  const item = processedData.find((d: any) => d.name === payload.value);
  const isChild = item?.isChild;
  const hasChildren = !isChild && item?.children && item.children.length > 0;

  return (
    <g transform={`translate(${x},${y})`}>
      {hasChildren && (
        <foreignObject x="-24" y="-12" width="24" height="24">
          <div
            className="cursor-pointer flex items-center justify-center h-full"
            onClick={() => onToggleExpand(payload.value)}
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
        className="text-sm fill-gray-600 dark:fill-gray-400 transition-opacity duration-300"
      >
        {isChild ? `↳ ${payload.value}` : payload.value}
      </text>
    </g>
  );
};

// Bar label component
const BarLabel = ({ x, y, width, height, value, formatter }: any) => {
  if (width < 40) return null;

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
      {formatter(value)}
    </text>
  );
};

// Legend component
const ChartLegend = ({ items }: { items: { name: string; color: string }[] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4 mt-4 justify-center">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="w-4 h-4 rounded mr-2" style={{ backgroundColor: item.color }} />
          <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

// Main component
const NestedBarChart = ({
  data,
  title,
  height = DEFAULT_HEIGHT,
  currency = DEFAULT_CURRENCY,
  locale = DEFAULT_LOCALE,
  childOpacity = DEFAULT_CHILD_OPACITY,
  maxBarRatio = DEFAULT_MAX_BAR_RATIO,
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

  // Process data without scaling
  const processedData = useMemo(() => {
    const items: BarItem[] = [];

    data.forEach((item) => {
      items.push(item);

      if (expandedItems[item.name] && item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          items.push({
            ...child,
            parent: item.name,
            isChild: true,
          });
        });
      }
    });

    return items;
  }, [data, expandedItems]);

  // Calculate maximum absolute value among parents
  const maxAbsValue = useMemo(() => {
    return Math.max(...data.map((item) => Math.abs(item.value)));
  }, [data]);

  // Set X-axis domain to ensure largest bar is 90% of chart width
  const domain = useMemo(() => {
    if (maxAbsValue === 0) return [-1, 1]; // Avoid division by zero
    const D = maxAbsValue / (2 * maxBarRatio); // e.g., maxBarRatio = 0.9
    return [-D, D];
  }, [maxAbsValue, maxBarRatio]);

  // Custom tooltip with currency and locale
  const customTooltipWithConfig = useCallback(
    (props: any) => <CustomTooltip {...props} currency={currency} locale={locale} />,
    [currency, locale],
  );

  return (
    <div className="w-full bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{title}</h2>

      <div style={{ height: `${height}px` }} className="transition-all duration-300">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            layout="vertical"
            margin={CHART_MARGINS}
            className="transition-all duration-300"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              className="dark:stroke-gray-600 transition-colors duration-200"
              horizontal={true}
              vertical={true}
            />
            <XAxis
              type="number"
              domain={domain}
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
                <CustomYAxisTick
                  {...props}
                  processedData={processedData}
                  expandedItems={expandedItems}
                  onToggleExpand={toggleExpand}
                />
              )}
            />
            <Tooltip content={tooltipContent || customTooltipWithConfig} />
            <ReferenceLine
              x={0}
              stroke="#666666"
              className="dark:stroke-gray-500 transition-colors duration-200"
            />
            <Bar
              dataKey="value"
              radius={[4, 4, 4, 4]}
              className="transition-all duration-300"
              label={(props) => <BarLabel {...props} formatter={xAxisFormatter} />}
            >
              {processedData.map((entry, index) => {
                const color = entry.isChild
                  ? entry.color +
                    Math.round(childOpacity * 255)
                      .toString(16)
                      .padStart(2, '0')
                  : entry.color;
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ChartLegend items={legendItems || []} />
    </div>
  );
};

export default NestedBarChart;
