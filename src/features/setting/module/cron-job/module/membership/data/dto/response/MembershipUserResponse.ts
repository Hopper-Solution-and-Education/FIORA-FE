import { _PaginationResponse } from '@/shared/types';

export interface MembershipUserItem {
  id: string;
  name: string | null;
  email: string;
}

export type MembershipUserListResponse = _PaginationResponse<MembershipUserItem>;
