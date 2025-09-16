import { MembershipCronjobFilterRequest } from '../dto/request/MembershipCronjobFilterRequest';
import { MembershipChartResponse } from '../dto/response/MembershipChartResponse';
import { MembershipCronjobPaginatedResponse } from '../dto/response/MembershipCronjobResponse';
import { MembershipTierListResponse } from '../dto/response/MembershipTierResponse';
import { MembershipUserListResponse } from '../dto/response/MembershipUserResponse';

export interface IMembershipCronjobDashboardApi {
  getMembershipCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: MembershipCronjobFilterRequest,
  ): Promise<MembershipCronjobPaginatedResponse>;

  getMembershipDynamicValue(): Promise<any>;

  getMembershipChartData(filter?: MembershipCronjobFilterRequest): Promise<MembershipChartResponse>;

  getMembershipTiers(page: number, pageSize: number): Promise<MembershipTierListResponse>;

  getMembershipUsers(page: number, pageSize: number): Promise<MembershipUserListResponse>;
}
