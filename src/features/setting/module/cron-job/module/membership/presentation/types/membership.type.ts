export type MembershipCronjobTableData = {
  id: string;
  email: string;
  executionTime: string;
  fromTier: string;
  spent: string;
  balance: string;
  toTier: string;
  status: string;
  reason?: string;
  updatedBy: {
    id: string;
    email: string;
  };
  transactionId: string | null;
};
