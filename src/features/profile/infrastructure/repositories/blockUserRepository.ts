import { prisma } from '@/config';
import { UserBlocked } from '../../domain/entities/models/profile';
import { IBlockUserRepository } from '../../domain/repositories/blockUserRepository';

class BlockUserRepository implements IBlockUserRepository {
  async getUserIdById(id: string): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });
    return user ? user.id : null;
  }
  async blockUser(blockUserId: string, userId: string): Promise<UserBlocked | null> {
    const userBlocked = await prisma.user.update({
      where: { id: blockUserId },
      data: {
        isBlocked: true,
        updatedBy: userId,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        isBlocked: true,
      },
    });

    return userBlocked ? userBlocked : null;
  }

  async isUserBlocked(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isBlocked: true,
      },
    });

    return user?.isBlocked === true;
  }
}

export const blockUserRepository = new BlockUserRepository();
