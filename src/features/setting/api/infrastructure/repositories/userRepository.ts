import prisma from '@/config/prisma/prisma';
import { InfinityParams, InfinityResult } from '@/shared/dtos/base-api-response.dto';
import { User } from '@prisma/client';
import { IUserRepository, OutputUserInfinity } from '../../repositories/userRepository.interface';

class UserRepository implements IUserRepository {
  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async findUsersByIds(ids: string[]): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async getUserInfinity(params: InfinityParams): Promise<InfinityResult<OutputUserInfinity>> {
    const { limit = 20, search, page } = params;

    const whereClause: any = {
      isDeleted: false,
    };

    if (search && search.trim().length > 0) {
      whereClause.email = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    const total = await prisma.user.count({
      where: whereClause,
    });

    const users = await prisma.user.findMany({
      where: whereClause,
      skip: (Number(page) - 1) * limit,
      take: limit,
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const hasMore = users.length > limit;
    const actualUsers = hasMore ? users.slice(0, limit) : users;
    const totalPages = Math.ceil(total / limit);

    return {
      items: actualUsers as unknown as OutputUserInfinity[],
      hasMore: Number(page) < totalPages,
    };
  }
}

export const userRepository = new UserRepository();
