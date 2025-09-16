import { _PaginationResponse } from '@/shared/types/httpResponse.types';

export interface MembershipCronjobItem {
  id: string;
  transactionId: string | null;
  typeCronJob: string;
  executionTime: string;
  createdBy: string | null;
  updatedBy: null | {
    id: string;
    name: string | null;
    email: string | null;
    MembershipProgress?: Array<{
      id: string;
      currentSpent: string;
      currentBalance: string;
      tier: {
        id: string;
        tierName: string;
        spentMinThreshold: string;
        spentMaxThreshold: string;
      };
    }>;
  };
  createdAt: string;
  updatedAt: string;
  status: string;
  dynamicValue?: Record<string, string> | null;
  balance?: string;
  spent?: string;
}

// The backend returns pagination fields at the root alongside data
// Example: { status, message, data: [...], totalPage, page, pageSize, total, statistics }
export type MembershipCronjobPaginatedResponse = _PaginationResponse<MembershipCronjobItem> &
  Partial<{
    statistics: {
      statusCounts?: { successful?: number; fail?: number };
    };
  }>;
