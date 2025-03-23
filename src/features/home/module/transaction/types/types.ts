export type OrderType = 'asc' | 'desc' | 'none';

export type Transaction = {
  id: string;
  userId: string;
  date: Date;
  type: 'Expense' | 'Income' | 'Transfer';
  amount: string;
  fromAccount?: string;
  fromCategory?: string;
  toAccount?: string;
  toCategory?: string;
  products: any[];
  partner?: string;
};

export type DropdownOption = {
  value: string;
  label: string;
  extra?: string | number;
};
