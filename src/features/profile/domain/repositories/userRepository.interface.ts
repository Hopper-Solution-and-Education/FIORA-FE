import { UserFilterParams, UserSearchResult } from '../entities/models/user.types';

export interface UserRepositoryInterface {
  getWithFilters(filters: any, skip: number, limit: number): Promise<UserSearchResult[]>;

  searchFilter(search: string): Promise<any>;

  buildFilters(params: UserFilterParams): Promise<any>;
}
