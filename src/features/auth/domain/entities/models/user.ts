// features/auth/domain/entities/models/user.ts
import { User as PrismaUser } from '@prisma/client';

export type User = PrismaUser;

export type UserInsert = {
  email: string;
  password: string;
};
