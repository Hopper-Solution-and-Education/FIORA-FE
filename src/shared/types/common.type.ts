export interface BaseResponse<T = any> {
  statusCode: number;
  message: string;
  data: T;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T = any> {
  items: T[];
  meta: PaginationMeta;
}

export interface ErrorDetail {
  property: string;
  children: any[];
  constraints: string | Record<string, string>;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  errors: {
    errorCode: string;
    details?: ErrorDetail[];
  };
}
