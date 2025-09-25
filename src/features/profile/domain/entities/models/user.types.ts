export interface UserFilterParams {
  search?: string;
  role?: string | string[];
  status?: string | string[];
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export interface UserSearchResult {
  id: string;
  name: string | null;
  email: string;
  role: string;
  isBlocked: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  avatarId: string | null;
}

export interface UsersResponse {
  status: number;
  message: string;
  data: UserSearchResult[];
}
