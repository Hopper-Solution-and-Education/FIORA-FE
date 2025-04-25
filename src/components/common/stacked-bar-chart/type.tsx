import { ReactNode } from 'react';
import { TooltipProps as RechartsTooltipProps } from 'recharts';

// Types for text positioning
export type TextPosition = 'top' | 'bottom' | 'center' | 'left' | 'right';

// Types for layer data
export type BarLayerData = {
  id: string;
  value: number;
  color: string;
  text?: string | ReactNode;
  textPosition?: TextPosition;
  type?: string;
};

// Types for transformed data
export type TransformedDataItem = {
  name: string;
  [key: string]: number | string | Record<string, string>;
  colors: Record<string, string>;
};

// Types for bar item
export type CustomBarItem = {
  id: string;
  name: string;
  icon?: string;
  type: string;
  colors: string[];
  layers: BarLayerData[];
  isOthers?: boolean;
};

// Types for tooltip
export type TooltipProps = RechartsTooltipProps<number, string>;

export type StackedBarProps = {
  data?: CustomBarItem[];
  title?: string;
  currency?: string;
  locale?: string;
  isLoading?: boolean;
  onItemClick?: (item: CustomBarItem) => void;
  className?: string;
  xAxisFormatter?: (value: number) => string;
  tutorialText?: string;
  legendItems?: { name: string; color: string }[];
  showExpandCollapse?: boolean;
  maxItems?: number;
};
