import { _PaginationResponse } from '@/shared/types';

export interface MembershipTierItem {
  id: string;
  tierName: string;
}

export type MembershipTierListResponse = _PaginationResponse<MembershipTierItem>;
