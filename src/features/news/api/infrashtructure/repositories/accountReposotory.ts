import { prisma } from '@/config';
import { IAccountRepository } from '../../domain/repository/accountRepository';

class AccountRepository implements IAccountRepository {
  async getRoleByUserId(userId: string): Promise<string | null> {
    const role = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });
    return role?.role ?? null;
  }
}

export const accountRepository = new AccountRepository();
