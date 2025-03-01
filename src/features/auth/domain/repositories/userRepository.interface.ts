import type { User } from '@prisma/client'; // Sử dụng User từ Prisma Client

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(user: { email: string; password: string }): Promise<User>;
  verifyPassword(email: string, password: string): Promise<User | null>;
}
