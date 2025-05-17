import { ColumnConfig, LineConfig } from '@/shared/types/chart.type';

export type ComposedChartDataItem = {
  name: string | number;
  [key: string]: string | number | undefined;
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
