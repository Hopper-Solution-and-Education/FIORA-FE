export type MembershipCronjobTableData = {
  id: string;
  executionTime: string;
  typeCronJob: string;
  status: string;
  createdBy: string | null;
  transactionId: string | null;
};
