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

// Get current date at start of day and end of day
const getCurrentDate = () => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    23,
    59,
    59,
    999,
  );
  return { startOfDay, endOfDay };
};

const { startOfDay, endOfDay } = getCurrentDate();

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
    fromDate: startOfDay,
    toDate: endOfDay,
  },
};
