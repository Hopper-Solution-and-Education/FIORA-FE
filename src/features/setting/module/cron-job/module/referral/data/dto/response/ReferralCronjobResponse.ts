import {
  CampaignSettings,
  ReferralCronjobTableData,
} from '../../../presentation/types/referral.type';

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

export type CampaignResponse = {
  id: string;
  name: string;
  dynamicValue: CampaignSettings;
};
