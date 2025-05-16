import { ContentType } from 'recharts/types/component/Tooltip';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

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

export type PositiveAndNegativeBarChartProps = {
  data: BarItem[];
  title?: string;
  currency?: string;
  locale?: string;
  xAxisFormatter?: (value: number) => string;
  tooltipContent?: ContentType<ValueType, NameType>;
  legendItems?: { name: string; color: string }[];
  maxBarRatio?: number;
  tutorialText?: string;
  callback?: (item: any) => void;
  levelConfig?: PositiveAndNegativeBarLevelConfig;
  height?: number;
  baseBarHeight?: number;
  expanded?: boolean;
  header?: React.ReactNode;
};

export interface ChartConfig {
  processedData: BarItem[];
  chartHeight: number;
  chartMargins: object;
  maxValue: number;
  minValue: number;
}
