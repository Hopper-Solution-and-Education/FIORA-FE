export type PaymentWalletTransaction = {
  id: string;
  createdAt: string;
  type: string;
  amount: number;
  from: string;
  to: string;
  remark: string;
  currency: string;
};

export type PaginationParams = {
  currentPage: number;
  pageSize: number;
  totalPage: number;
  totalItems: number;
};

export const initPaginationParams: PaginationParams = {
  currentPage: 1,
  pageSize: 20,
  totalPage: 0,
  totalItems: 0,
};
