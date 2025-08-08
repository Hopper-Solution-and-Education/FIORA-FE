import { User } from '@prisma/client';

export interface IUserRepository {
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findUsersByIds(ids: string[]): Promise<User[]>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
}
