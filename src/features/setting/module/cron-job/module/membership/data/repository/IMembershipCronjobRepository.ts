import { MembershipCronjobFilterRequest } from '../dto/request/MembershipCronjobFilterRequest';
import { MembershipResendRequest } from '../dto/request/MembershipResendRequest';
import { MembershipChartResponse } from '../dto/response/MembershipChartResponse';
import { MembershipCronjobPaginatedResponse } from '../dto/response/MembershipCronjobResponse';
import { MembershipTierListResponse } from '../dto/response/MembershipTierResponse';
import { MembershipUserListResponse } from '../dto/response/MembershipUserResponse';

export interface IMembershipCronjobRepository {
  getMembershipCronjobsPaginated(
    page: number,
    pageSize: number,
    filter?: MembershipCronjobFilterRequest,
  ): Promise<MembershipCronjobPaginatedResponse>;
  getMembershipDynamicValue(): Promise<string[]>;
  getMembershipChartData(filter?: MembershipCronjobFilterRequest): Promise<MembershipChartResponse>;
  getMembershipTiers(page: number, pageSize: number): Promise<MembershipTierListResponse>;
  getMembershipUsers(page: number, pageSize: number): Promise<MembershipUserListResponse>;
  resendMembership(id: string, body: MembershipResendRequest): Promise<any>;
}
