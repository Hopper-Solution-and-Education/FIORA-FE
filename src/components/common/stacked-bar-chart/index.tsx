'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/shared/utils';

// Types
export type StackedChartDataItem = {
  id: string;
  name: string;
  layer1: number;
  layer2?: number;
  layer3?: number;
  type: 'expense' | 'income' | 'profit';
  children?: StackedChartDataItem[];
};

export type StackedBarChartProps = {
  data?: StackedChartDataItem[];
  title?: string;
  currency?: string;
  isLoading?: boolean;
  maxLayerDepth?: number; // Maximum number of layers to display (1-3)
  onItemClick?: (item: StackedChartDataItem) => void;
  className?: string;
};

// Constants
const DEFAULT_CURRENCY = 'USD';
const DEFAULT_LOCALE = 'en-US';
const MIN_CHART_HEIGHT = 300;
const BASE_BAR_HEIGHT = 60;

// Color mapping for different data types and layers
const TYPE_COLORS = {
  expense: {
    layer1: 'hsl(var(--chart-1))',
    layer2: 'hsla(var(--chart-1), 0.7)',
    layer3: 'hsla(var(--chart-1), 0.4)',
  },
  income: {
    layer1: 'hsl(var(--chart-2))',
    layer2: 'hsla(var(--chart-2), 0.7)',
    layer3: 'hsla(var(--chart-2), 0.4)',
  },
  profit: {
    layer1: 'hsl(var(--chart-3))',
    layer2: 'hsla(var(--chart-3), 0.7)',
    layer3: 'hsla(var(--chart-3), 0.4)',
  },
};

const StackedBarChart = ({
  data = [],
  title = 'Financial Overview',
  currency = DEFAULT_CURRENCY,
  isLoading = false,
  maxLayerDepth = 3, // Default to 3 layers
  onItemClick,
  className,
}: StackedBarChartProps) => {
  // State
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [chartHeight, setChartHeight] = useState(MIN_CHART_HEIGHT);
  const [isFetching, setIsFetching] = useState(true);

  // Simulate data fetching
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFetching(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Toggle item expansion
  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Process data to include expanded children
  const processedData = useMemo(() => {
    const result: StackedChartDataItem[] = [];

    const processItem = (item: StackedChartDataItem) => {
      // Create a copy of the item with only the layers we want to display
      const processedItem: StackedChartDataItem = {
        ...item,
        layer2: maxLayerDepth >= 2 ? item.layer2 : undefined,
        layer3: maxLayerDepth >= 3 ? item.layer3 : undefined,
      };

      result.push(processedItem);

      if (expandedItems[item.id] && item.children?.length) {
        item.children.forEach(processItem);
      }
    };

    data.forEach(processItem);
    return result;
  }, [data, expandedItems, maxLayerDepth]);

  // Update chart height based on number of items
  useEffect(() => {
    const numBars = processedData.length;
    const newHeight = Math.max(numBars * BASE_BAR_HEIGHT, MIN_CHART_HEIGHT);
    setChartHeight(newHeight);
  }, [processedData]);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
      style: 'currency',
      currency,
      notation: 'compact',
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Custom tooltip content
  const renderTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    const item = processedData.find((item) => item.name === label);
    if (!item) return null;

    return (
      <div className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>

        {payload.map((entry: any, index: number) => {
          const layerName = entry.dataKey.charAt(5); // Extract the layer number
          return (
            <p key={index} className="text-xs text-gray-600 dark:text-gray-400">
              Layer {layerName}: <span className="font-bold">{formatCurrency(entry.value)}</span>
            </p>
          );
        })}

        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Total:{' '}
          <span className="font-bold">
            {formatCurrency(payload.reduce((sum: number, entry: any) => sum + entry.value, 0))}
          </span>
        </p>
      </div>
    );
  };

  // Custom Y-axis tick
  const CustomYAxisTick = (props: any): any => {
    const { x, y, payload } = props;
    const item = processedData.find((d) => d.name === payload.value);

    if (!item) return null;

    const hasChildren = item.children && item.children.length > 0;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-8}
          y={0}
          dy={4}
          textAnchor="end"
          fill="currentColor"
          className="text-sm text-gray-600 dark:text-gray-400"
        >
          {payload.value}
        </text>

        {hasChildren && (
          <foreignObject x={-30} y={-10} width={20} height={20}>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0"
              onClick={() => toggleExpand(item.id)}
            >
              {expandedItems[item.id] ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </foreignObject>
        )}
      </g>
    );
  };

  // Render loading skeleton
  if (isLoading || isFetching) {
    return (
      <div
        className={cn(
          'w-full p-4 space-y-4 rounded-lg border border-gray-100 dark:border-gray-800',
          className,
        )}
      >
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className={`h-12 w-${8 - i * 2}/12`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Get the colors for the current type
  const getTypeColors = (type: 'expense' | 'income' | 'profit') => {
    return TYPE_COLORS[type] || TYPE_COLORS.expense;
  };

  // Determine which layers to render based on maxLayerDepth
  const renderBars = () => {
    // Get the first item's type to determine colors
    // In a real app, you might want to handle mixed types differently
    const firstItemType = processedData[0]?.type || 'expense';
    const colors = getTypeColors(firstItemType);

    const bars = [];

    // Always render layer 1
    bars.push(
      <Bar
        key="layer1"
        dataKey="layer1"
        stackId="a"
        fill={colors.layer1}
        name="Layer 1"
        onClick={(data) =>
          onItemClick &&
          onItemClick(processedData.find((item) => item.name === data.name) as StackedChartDataItem)
        }
      />,
    );

    // Conditionally render layer 2
    if (maxLayerDepth >= 2) {
      bars.push(
        <Bar
          key="layer2"
          dataKey="layer2"
          stackId="a"
          fill={colors.layer2}
          name="Layer 2"
          onClick={(data) =>
            onItemClick &&
            onItemClick(
              processedData.find((item) => item.name === data.name) as StackedChartDataItem,
            )
          }
        />,
      );
    }

    // Conditionally render layer 3
    if (maxLayerDepth >= 3) {
      bars.push(
        <Bar
          key="layer3"
          dataKey="layer3"
          stackId="a"
          fill={colors.layer3}
          name="Layer 3"
          onClick={(data) =>
            onItemClick &&
            onItemClick(
              processedData.find((item) => item.name === data.name) as StackedChartDataItem,
            )
          }
        />,
      );
    }

    return bars;
  };

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
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">
                  Stacked financial data with {maxLayerDepth} layer{maxLayerDepth > 1 ? 's' : ''}
                </p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
      )}

      <div style={{ height: `${chartHeight}px` }} className="transition-all duration-300">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <BarChart
            data={processedData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
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
              tickFormatter={formatCurrency}
              className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
            />
            <YAxis
              type="category"
              dataKey="name"
              className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200"
              tickLine={false}
              axisLine={false}
              tick={CustomYAxisTick}
            />
            <Tooltip content={renderTooltipContent} />
            <Legend />
            {renderBars()}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StackedBarChart;
