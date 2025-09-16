export interface ReferralCronjobFilterState {
  status?: string[] | null;
  typeOfBenefit?: string[] | null;
  emailReferrer?: string[] | null;
  emailReferee?: string[] | null;
  updatedBy?: string[] | null;
  search?: string | null;
  fromDate: Date | null;
  toDate: Date | null;
}

export interface ReferralCronjobState {
  loading: boolean;
  error: string | null;
  filter: ReferralCronjobFilterState;
}

export const initialState: ReferralCronjobState = {
  loading: false,
  error: null,
  filter: {
    status: null,
    typeOfBenefit: null,
    emailReferrer: null,
    emailReferee: null,
    updatedBy: null,
    search: null,
    fromDate: null,
    toDate: null,
  },
};
