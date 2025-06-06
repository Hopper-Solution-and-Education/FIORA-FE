import { BaseChartProps, ColumnConfig, LineConfig } from '@/shared/types/chart.type';

export type ComposedChartDataItem = {
  name: string | number;
  icon?: string;
  color?: string;
  [key: string]: string | number | undefined;
};

export interface ComposedChartProps extends BaseChartProps<ComposedChartDataItem> {
  columns: ColumnConfig[];
  lines?: LineConfig[];
  tooltipFormatter?: (data: any) => React.ReactNode;
}
