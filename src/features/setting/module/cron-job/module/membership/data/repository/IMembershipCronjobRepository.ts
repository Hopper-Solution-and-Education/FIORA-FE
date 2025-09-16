import { MembershipCronjobFilterRequest } from '../dto/request/MembershipCronjobFilterRequest';
import { MembershipChartResponse } from '../dto/response/MembershipChartResponse';
import { MembershipCronjobPaginatedResponse } from '../dto/response/MembershipCronjobResponse';

export interface IMembershipCronjobRepository {
  getMembershipCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: MembershipCronjobFilterRequest,
  ): Promise<MembershipCronjobPaginatedResponse>;
  getMembershipDynamicValue(): Promise<string[]>;
  getMembershipChartData(filter?: MembershipCronjobFilterRequest): Promise<MembershipChartResponse>;
}
