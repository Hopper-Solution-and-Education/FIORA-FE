/**
 * Request DTO for getting PackageFX with pagination and sorting
 */
export interface GetPackageFXPaginatedRequest {
  sortBy?: Record<string, 'asc' | 'desc'>;
  page?: number;
  limit?: number;
  append?: boolean;
  search?: string;
}
