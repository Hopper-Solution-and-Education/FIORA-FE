import { ReactNode } from 'react';
import { TooltipProps as RechartsTooltipProps } from 'recharts';

export interface ComparisonProps {
  keyToCompare: string;
  referenceKey: string;
  columns: string[];
  styleWhenGreater: string;
  styleWhenLessOrEqual: string;
  comparisonType?: 'greater' | 'less' | 'equal' | 'greaterOrEqual' | 'lessOrEqual';
}

export interface BaseChartProps<T> {
  data: T[];
  title?: string;
  currency?: string;
  locale?: string;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: any) => string;
  isLoading?: boolean;
  callback?: (item: T) => void;
  height?: number;
  fontSize?: ChartFontSize;
  tickCount?: number;
  className?: string;
  showLegend?: boolean;
  tooltipContent?: ReactNode;
  tutorialText?: string;
  legendItems?: LegendItem[];
  /**
   * Enable automatic sorting of data by value
   * - For vertical charts: sorts highest values first (left to right)
   * - For horizontal charts: sorts highest values first (top to bottom)
   * @default true
   */
  sortEnable?: boolean;
}

export type ColumnConfig = {
  key: string;
  name: string;
  color: string;
  icon?: string;
  stackId?: string;
  customCell?: (entry: any, index: number) => React.ReactNode;
};

export type LineConfig = {
  key: string;
  name: string;
  color: string;
};

export interface LegendItem {
  name: string;
  color: string;
}

export interface ChartFontSize {
  title?: number;
  axis?: number;
  tooltip?: number;
  legend?: number;
}

export type TooltipProps = RechartsTooltipProps<number, string>;
