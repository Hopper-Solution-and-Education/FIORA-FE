import { TooltipProps as RechartsTooltipProps } from 'recharts';

export type ColumnConfig = {
  key: string;
  name: string;
  color: string;
};

export type LineConfig = {
  key: string;
  name: string;
  color: string;
};

export interface LegendItem {
  name: string;
  color: string;
}

export type TooltipProps = RechartsTooltipProps<number, string>;
