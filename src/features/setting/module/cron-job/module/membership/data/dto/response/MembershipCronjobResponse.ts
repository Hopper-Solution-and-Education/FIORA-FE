import { _PaginationResponse } from '@/shared/types';

export interface MembershipCronjobItem {
  id: string;
  transactionId: string | null;
  typeCronJob: string;
  executionTime: string;
  createdBy: {
    email: string | null;
  };
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

export type MembershipCronjobPaginatedResponse = _PaginationResponse<MembershipCronjobItem> &
  Partial<{
    statistics: {
      statusCounts?: { successful?: number; fail?: number };
    };
  }>;
