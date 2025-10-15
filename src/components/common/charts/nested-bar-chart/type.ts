import { BaseChartProps } from '@/shared/types/chart.type';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { ContentType } from 'recharts/types/component/Tooltip';

// Define the structure of a bar item
export type BarItem = {
  id?: string;
  icon?: string;
  name: string;
  value: number;
  color: string;
  type: string;
  parent?: string;
  children?: BarItem[];
  isChild?: boolean;
  depth?: number;
  isOthers?: boolean;
};

// Configuration for levels in the chart
export type LevelConfig = {
  totalName?: string;
  colors: {
    [depth: number]: string;
  };
};

// Props for the NestedBarChart component
export interface NestedBarChartProps extends Omit<BaseChartProps<BarItem>, 'tooltipContent'> {
  tooltipContent?: ContentType<ValueType, NameType>;
  maxBarRatio?: number;
  levelConfig?: LevelConfig;
  expanded?: boolean;
}
