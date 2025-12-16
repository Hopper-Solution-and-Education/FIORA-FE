import { BaseChartProps, ColumnConfig } from '@/shared/types';

export type VerticalBarDataItem = {
  name: string | number;
  [key: string]: string | number | undefined;
};

export interface VerticalPositiveNegativeBarChartProps extends BaseChartProps<VerticalBarDataItem> {
  columns: ColumnConfig[];
}
