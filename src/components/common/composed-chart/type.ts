import { TooltipProps as RechartsTooltipProps } from 'recharts';

export type ComposedChartDataItem = {
  name: string | number;
  [key: string]: any; // Cho phép các trường động
};

export type ColumnConfig = {
  key: string;
  name: string;
  color: string;
};

export type LineConfig = {
  key: string;
  name: string;
  color: string;
};

export type ComposedChartProps = {
  data?: ComposedChartDataItem[];
  title?: string;
  currency?: string;
  locale?: string;
  isLoading?: boolean;
  callback?: (item: any) => void;
  className?: string;
  xAxisFormatter?: (value: any) => string;
  yAxisFormatter?: (value: number) => string;
  columns: ColumnConfig[]; // Mảng cấu hình cho các cột
  lines?: LineConfig[]; // Mảng cấu hình cho các đường
  showLegend?: boolean;
  height?: number;
  fontSize?: {
    title?: number;
    axis?: number;
    tooltip?: number;
    legend?: number;
  };
  tickCount?: number;
};

export type TooltipProps = RechartsTooltipProps<number, string>;
