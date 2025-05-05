import { CustomBarItem } from '@/components/common/stacked-bar-chart/type';
import { STACK_TYPE } from '@/shared/constants/chart';

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
  children?: HierarchicalBarItem[];
  data?: ChartItem[];
  level?: number;
  type: STACK_TYPE;
}
