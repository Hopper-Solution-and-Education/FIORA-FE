export interface MembershipCronjobFilterRequest {
  status?: string | string[];
  typeCronJob?: string | string[]; // e.g. 'MEMBERSHIP'
  search?: string;
  fromDate?: Date | string;
  toDate?: Date | string;
}
