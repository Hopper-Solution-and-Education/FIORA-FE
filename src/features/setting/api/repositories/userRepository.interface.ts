import { InfinityParams, InfinityResult } from '@/shared/dtos/base-api-response.dto';
import { User } from '@prisma/client';

export interface OutputUserInfinity {
  id?: string;
  name?: string | null;
  email?: string | null;
}

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUsersByIds(ids: string[]): Promise<User[]>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  getUserInfinity(params: InfinityParams): Promise<InfinityResult<OutputUserInfinity>>;
}
