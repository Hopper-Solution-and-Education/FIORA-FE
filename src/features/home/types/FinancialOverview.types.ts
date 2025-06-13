export interface Account {
  id: string;
  userId: string;
  icon: string;
  name: string;
  description: string;
  type: string;
  currency: string;
  limit: number;
  balance: number;
  parentId: string | null;
  subAccounts?: Account[];
}
