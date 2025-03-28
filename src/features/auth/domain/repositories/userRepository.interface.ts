import type { User } from '@prisma/client'; // Sử dụng User từ Prisma Client

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  createUser(user: { email: string; hashedPassword: string }): Promise<User>;
  verifyPassword(email: string, password: string): Promise<User | null>;
  verifyUser(email: string): Promise<User>;
  checkIsExistedUserById(id: string): Promise<User | null>;
}
