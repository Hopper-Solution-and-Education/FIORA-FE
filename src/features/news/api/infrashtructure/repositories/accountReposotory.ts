import { prisma } from '@/config';
import { IAccountRepository } from '../../domain/repository/accountRepository';
import { AttachmentResponse } from '../../types/attachmentDTO';

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

  async getAvatarByIds(avatarIds: string[]): Promise<AttachmentResponse[]> {
    return prisma.attachment.findMany({
      where: {
        id: {
          in: avatarIds,
        },
      },
      select: {
        id: true,
        url: true,
      },
    });
  }
}

export const accountRepository = new AccountRepository();
