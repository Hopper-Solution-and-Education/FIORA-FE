import { CustomBarItem } from '@/components/common/charts/stacked-bar-chart/type';
import { STACK_TYPE } from '@/shared/constants';

export interface ChartLayer {
  id: string;
  value: number;
  color: string;
}

export interface ChartItem extends CustomBarItem {
  layers: ChartLayer[];
}

export interface HierarchicalBarItem {
  id: string;
  name: string;
  value?: number;
  level?: number; // 0: year, 1: half-year, 2: quarter, 3: month
  children?: HierarchicalBarItem[];
  data?: ChartItem[];
  type: STACK_TYPE;
}
