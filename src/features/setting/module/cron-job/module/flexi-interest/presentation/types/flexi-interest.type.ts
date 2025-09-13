export type FlexiInterestCronjobTableStatusType = 'successful' | 'fail';

export type FlexiInterestCronjobTableData = {
  id: string;
  email: string;
  executionTime: string;
  tier: string;
  rate: number;
  activeBalance: number;
  amount: number;
  status: FlexiInterestCronjobTableStatusType;
  updateBy: string;
  reason?: string;
};
