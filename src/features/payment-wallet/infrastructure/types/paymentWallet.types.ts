export interface FetchPaymentWalletParams {
  filters: any;
  lastCursor?: string;
  page?: number;
  pageSize: number;
  searchParams?: string;
  sortBy?: Record<string, 'asc' | 'desc'>;
}
