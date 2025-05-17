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
export type NestedBarChartProps = {
  data: BarItem[];
  title?: string;
  currency?: string;
  locale?: string;
  tooltipContent?: ContentType<ValueType, NameType>;
  legendItems?: { name: string; color: string }[];
  maxBarRatio?: number;
  tutorialText?: string;
  levelConfig?: LevelConfig;
  expanded?: boolean;
  xAxisFormatter?: (value: number) => string;
  callback?: (item: any) => void;
};
