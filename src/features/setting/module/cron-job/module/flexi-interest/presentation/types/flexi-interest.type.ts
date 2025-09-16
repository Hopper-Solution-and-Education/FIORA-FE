export type FlexiInterestCronjobTableStatusType = 'SUCCESSFUL' | 'FAIL';

export type FlexiInterestCronjobTableData = {
  id: string;
  email?: string;
  dateTime: string;
  membershipTier?: string;
  flexiInterestRate?: number;
  activeBalance?: number;
  flexiInterestAmount?: number;
  status: FlexiInterestCronjobTableStatusType;
  updateBy?: string;
  reason?: string;
};
