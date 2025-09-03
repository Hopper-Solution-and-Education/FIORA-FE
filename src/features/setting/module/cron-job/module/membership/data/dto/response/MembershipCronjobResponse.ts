import { HttpResponse, PaginationResponse } from '@/shared/types';

export interface MembershipCronjobItem {
  id: string;
  transactionId: string | null;
  typeCronJob: string;
  executionTime: string;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  Transaction: null | {
    id: string;
    amount: string;
    currency: string;
    date: string;
    type: string;
    userId: string;
    user?: {
      id: string;
      name: string | null;
      email: string | null;
      role: string | null;
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
  };
}

export type MembershipCronjobPaginatedResponse = HttpResponse<
  PaginationResponse<MembershipCronjobItem> & {
    statistics?: {
      statusCounts?: { successful?: number; fail?: number };
    };
  }
>;
