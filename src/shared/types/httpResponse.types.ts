export interface HttpResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface _Pagination<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalPage: number;
  total: number;
  hasMore?: boolean;
}

export type _PaginationResponse<T> = HttpResponse<_Pagination<T>>;
