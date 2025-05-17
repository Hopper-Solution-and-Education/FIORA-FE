import { ReactNode } from 'react';
import { ColumnConfig, LegendItem } from '@/shared/types/chart.type';

export type VerticalBarDataItem = {
  name: string | number;
  [key: string]: string | number | undefined;
};

export interface VerticalPositiveNegativeLevelConfig {
  totalName: string;
  colorPositive?: Record<0 | 1 | 2, string>;
  colorNegative?: Record<0 | 1 | 2, string>;
}

export interface VerticalPositiveNegativeBarChartProps {
  data: VerticalBarDataItem[];
  title?: string;
  currency?: string;
  locale?: string;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: number) => string;
  tooltipContent?: ReactNode;
  legendItems?: LegendItem[];
  tutorialText?: string;
  isLoading?: boolean;
  callback?: (item: any) => void;
  columns: ColumnConfig[];
  showLegend?: boolean;
  height?: number;
  fontSize?: {
    title?: number;
    axis?: number;
    tooltip?: number;
    legend?: number;
  };
  tickCount?: number;
}
