import { BaseChartProps } from '@/shared/types';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { ContentType } from 'recharts/types/component/Tooltip';

export type BarItem = {
  id?: string;
  icon?: string;
  name: string;
  value: number;
  color?: string;
  type: string;
  parent?: string;
  children?: BarItem[];
  isChild?: boolean;
  depth?: number;
};

export type PositiveAndNegativeBarLevelConfig = {
  totalName?: string;
  colorPositive: {
    [depth: number]: string;
  };
  colorNegative: {
    [depth: number]: string;
  };
};

export interface PositiveAndNegativeBarChartProps extends Omit<
  BaseChartProps<BarItem>,
  'tooltipContent'
> {
  tooltipContent?: ContentType<ValueType, NameType>;
  maxBarRatio?: number;
  levelConfig?: PositiveAndNegativeBarLevelConfig;
  baseBarHeight?: number;
  expanded?: boolean;
  header?: React.ReactNode;
}

export interface ChartConfig {
  processedData: BarItem[];
  chartHeight: number;
  chartMargins: object;
  maxValue: number;
  minValue: number;
}
