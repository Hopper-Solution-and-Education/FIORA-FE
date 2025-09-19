export interface ReferralCronjobFilterRequest {
  status?: string[];
  typeOfBenefit?: string[];
  emailReferrer?: string[];
  emailReferee?: string[];
  updatedBy?: string[];
  search?: string;
  fromDate?: string;
  toDate?: string;
}
