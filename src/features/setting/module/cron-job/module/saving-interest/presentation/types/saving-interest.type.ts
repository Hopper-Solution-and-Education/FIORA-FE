export type SavingInterestTableData = {
  id: string;
  email: string;
  dateTime: string; // Changed from executionTime to match real API
  membershipTier: string;
  smartSavingRate: string; // Changed from savingInterestRate to match real API
  activeBalance: string;
  smartSavingAmount: string; // Changed from savingInterestAmount to match real API
  status: string;
  updateBy: string; // Changed from updatedBy object to string to match real API
  reason: string | null;
  userId: string | null; // Added field from real API
};

export type SavingInterestChartItem = {
  tierName: string; // Changed from membershipTier to match real API
  interestAmount: string; // Changed from totalAmount to match real API
  percent: string; // Changed from count to match real API
};
