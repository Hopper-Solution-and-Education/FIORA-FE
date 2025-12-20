import { Response } from '@/shared/types';
import { CampaignSettings } from '../../presentation/types/referral.type';
import { ReferralCronjobFilterRequest } from '../dto/request/ReferralCronjobFilterRequest';
import { ReferralChartResponse } from '../dto/response/ReferralChartResponse';
import {
  CampaignResponse,
  ReferralCronjobPaginatedResponse,
} from '../dto/response/ReferralCronjobResponse';

export interface IReferralCronjobDashboardApi {
  getReferralCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralCronjobPaginatedResponse>;

  getReferralChartData(filter?: ReferralCronjobFilterRequest): Promise<ReferralChartResponse>;

  getReferralFilterOptions(): Promise<any>;

  getCampaign(): Promise<Response<CampaignResponse>>;

  upsertCampaign(data: CampaignSettings): Promise<any>;
}
