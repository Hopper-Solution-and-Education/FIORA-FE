export type MembershipCronjobTableData = {
  id: string;
  email: string;
  executionTime: string;
  fromTier: string;
  spent: string;
  balance: string;
  toTier: string;
  status: string;
  createdBy: string | null;
  transactionId: string | null;
};
