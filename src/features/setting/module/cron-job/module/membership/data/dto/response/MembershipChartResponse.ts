import { HttpResponse } from '@/shared/types';

export interface MembershipChartItem {
  tierId: string;
  tierName: string;
  count: number;
}

export interface MembershipChartData {
  total: number;
  items: MembershipChartItem[];
}

export type MembershipChartResponse = HttpResponse<MembershipChartData>;
