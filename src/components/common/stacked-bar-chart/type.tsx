import { STACK_TYPE } from '@/shared/constants/chart';
import { TooltipProps as RechartsTooltipProps } from 'recharts';

// Types for bar item
export type CustomBarItem = {
  name: string;
  icon?: string;
  type: STACK_TYPE;
  A: number;
  T: number;
  B: number;
  colors: {
    A: string;
    T: string;
    B: string;
  };
};

export type StackBarDisplay = CustomBarItem & {
  maxKey: string;
  AOriginalValue: number;
  BOriginalValue: number;
  TOriginalValue: number;
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
};
