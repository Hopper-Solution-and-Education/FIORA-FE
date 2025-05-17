import { TooltipProps as RechartsTooltipProps } from 'recharts';

export type ComposedChartDataItem = {
  name: string | number;
  [key: string]: string | number | undefined;
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
  columns: ColumnConfig[];
  lines: LineConfig[];
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
