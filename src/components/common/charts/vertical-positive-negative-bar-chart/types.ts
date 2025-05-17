import { BaseChartProps, ColumnConfig } from '@/shared/types/chart.type';

export type VerticalBarDataItem = {
  name: string | number;
  [key: string]: string | number | undefined;
};

export interface VerticalPositiveNegativeBarChartProps extends BaseChartProps<VerticalBarDataItem> {
  columns: ColumnConfig[];
}
