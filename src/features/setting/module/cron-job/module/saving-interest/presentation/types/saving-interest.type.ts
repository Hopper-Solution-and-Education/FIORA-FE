export type SavingInterestTableData = {
  id: string;
  email: string;
  executionTime: string;
  membershipTier: string;
  savingInterestRate: string;
  activeBalance: string;
  savingInterestAmount: string;
  status: string;
  updatedBy: {
    id: string;
    email: string;
  };
  reason: string | null;
};

export type SavingInterestChartItem = {
  membershipTier: string;
  totalAmount: number;
  count: number;
};
