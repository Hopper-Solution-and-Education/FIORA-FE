import { User } from '@prisma/client';

export interface UserInfinityParams {
  limit?: number;
  search?: string;
  page?: string;
}
export interface OutputUserInfinity {
  id?: number;
  name?: string;
  email?: string;
}

export interface UserInfinityResult {
  users: OutputUserInfinity[];
  hasMore: boolean;
}

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUsersByIds(ids: string[]): Promise<User[]>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  getUserInfinity(params: UserInfinityParams): Promise<UserInfinityResult>;
}
