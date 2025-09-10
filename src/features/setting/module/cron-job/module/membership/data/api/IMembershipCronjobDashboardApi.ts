import { MembershipCronjobFilterRequest } from '../dto/request/MembershipCronjobFilterRequest';
import { MembershipCronjobPaginatedResponse } from '../dto/response/MembershipCronjobResponse';

export interface IMembershipCronjobDashboardApi {
  getMembershipCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: MembershipCronjobFilterRequest,
  ): Promise<MembershipCronjobPaginatedResponse>;

  getMembershipDynamicValue() : Promise<any>;
}
