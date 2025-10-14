import { BaseChartProps } from '@/shared/types/chart.type';
import { CustomBarItem, StackBarDisplay } from '../stacked-bar-chart/type';

export interface ChartDataConfig {
  hasNegativeValues: boolean;
  positiveData: StackBarDisplay[];
  negativeData: StackBarDisplay[];
  minNegative: number;
  maxPositive: number;
  chartHeight: number;
  negativeChartMargins: object;
  positiveChartMargins: object;
  calculateRValue: (item: StackBarDisplay) => number;
}

export interface PositiveNegativeStackBarChartProps extends Omit<BaseChartProps<CustomBarItem>, 'data'> {
  data?: CustomBarItem[];
  icon?: string;
  showButton?: boolean;
  onClickButton?: () => void;
  onClickTitle?: () => void;
}
