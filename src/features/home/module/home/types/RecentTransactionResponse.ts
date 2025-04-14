import type { Transaction } from '@prisma/client';

export type FromAccount = {
  id: string;
  userId: string;
  icon: string;
  name: string;
  description?: string;
  balance: string;
  limit: string;
  parentId: string | null;
  type: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  createdBy: string;
};

export type ToAccount = {
  id: string;
  userId: string;
  icon?: string;
  name: string;
  description?: string;
  balance: string;
  limit: string;
  type: string;

  // Các trường bổ sung nếu có
};

export type Partner = {
  id: string;
  userId: string;
  logo: string;
  name: string;
  identify?: string | null;
  // Các trường bổ sung nếu có
};

export type ToCategory = {
  id: string;
  userId: string;
  type: string; // ví dụ: 'Expense', 'Income'
  icon: string;
  name: string;
  // Các trường bổ sung nếu có
};

export type CurrentTransaction = Transaction & {
  fromAccount: FromAccount;
  toAccount: ToAccount | null; // có thể null nếu không có dữ liệu
  partner: Partner;
  toCategory: ToCategory;
};

export interface ICurrentTransactionPaginatedResponse {
  data: CurrentTransaction[];
  amountMin: number;
  amountMax: number;
  page: number;
  pageSize: number;
  totalPage: number;
  total: number;
}
