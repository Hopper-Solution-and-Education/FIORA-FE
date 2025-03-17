// Import interfaces
export interface PaginationResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalPage: number;
}

export interface Pagination {
  page?: number;
  pageSize?: number;
}

export interface HttpResponse<T> {
  status: number;
  message: string;
  data: T;
}
