export interface InfinityParams {
  limit?: number;
  search?: string;
  page?: string;
}

export interface InfinityResult<T> {
  items: T[];
  hasMore: boolean;
}
