export type ReferralCronjobTableData = {
  id: string;
  emailReferrer: string;
  emailReferee: string;
  executionTime: string;
  typeOfBenefit: string;
  spent: string;
  amount: string;
  status: string;
  updatedBy: {
    id: string;
    email: string;
  };
  reason: string | null;
  transactionId: string | null;
};
