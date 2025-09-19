export interface ReferralCronjobFilterState {
  status: string[];
  typeOfBenefit: string[];
  emailReferrer: string[];
  emailReferee: string[];
  updatedBy: string[];
  search: string;
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
    status: [],
    typeOfBenefit: [],
    emailReferrer: [],
    emailReferee: [],
    updatedBy: [],
    search: '',
    fromDate: null,
    toDate: null,
  },
};
