import { ReferralCronjobTableData } from '../../../presentation/types/referral.type';

export interface ReferralCronjobPaginatedResponse {
  data: {
    items: ReferralCronjobTableData[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
  message: string;
  success: boolean;
}
