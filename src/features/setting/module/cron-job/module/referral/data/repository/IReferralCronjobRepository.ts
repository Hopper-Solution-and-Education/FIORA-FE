import { ReferralCronjobFilterRequest } from '../dto/request/ReferralCronjobFilterRequest';
import { ReferralChartResponse } from '../dto/response/ReferralChartResponse';
import { ReferralCronjobPaginatedResponse } from '../dto/response/ReferralCronjobResponse';

export interface IReferralCronjobRepository {
  getReferralCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: ReferralCronjobFilterRequest,
  ): Promise<ReferralCronjobPaginatedResponse>;

  getReferralChartData(filter?: ReferralCronjobFilterRequest): Promise<ReferralChartResponse>;
}
