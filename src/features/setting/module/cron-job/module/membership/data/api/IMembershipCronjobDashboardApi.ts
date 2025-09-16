import { MembershipCronjobFilterRequest } from '../dto/request/MembershipCronjobFilterRequest';
import { MembershipChartResponse } from '../dto/response/MembershipChartResponse';
import { MembershipCronjobPaginatedResponse } from '../dto/response/MembershipCronjobResponse';

export interface IMembershipCronjobDashboardApi {
  getMembershipCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: MembershipCronjobFilterRequest,
  ): Promise<MembershipCronjobPaginatedResponse>;

  getMembershipDynamicValue(): Promise<any>;

  getMembershipChartData(filter?: MembershipCronjobFilterRequest): Promise<MembershipChartResponse>;
}
