import { prisma } from '@/config';
import { Partner, Prisma } from '@prisma/client';
import { IPartnerRepository } from '../../domain/repositories/partnerRepository.interface';
import { PartnerExtras } from '@/shared/types/partner.types';

class PartnerRepository implements IPartnerRepository {
  async getPartnersByUserId(
    userId: string,
    include?: Prisma.PartnerInclude | string,
    where?: Prisma.PartnerWhereInput,
  ): Promise<PartnerExtras[]> {
    let includeObj: Prisma.PartnerInclude = {
      transactions: true,
      children: true,
      parent: true,
    };

    if (include) {
      if (typeof include === 'string') {
        try {
          const parsedInclude = JSON.parse(include) as Prisma.PartnerInclude;
          includeObj = parsedInclude;
        } catch (error) {
          console.error('Invalid include JSON:', error);
        }
      } else {
        includeObj = include;
      }
    }

    return (await prisma.partner.findMany({
      where: {
        userId: userId,
        ...where,
      },
      include: includeObj,
      orderBy: { transactions: { _count: 'desc' } },
    })) as unknown as PartnerExtras[];
  }

  async findManyPartner(where: Prisma.PartnerWhereInput, options?: Prisma.PartnerFindManyArgs) {
    return await prisma.partner.findMany({
      where,
      ...options,
    });
  }

  async getPartnerById(id: string, userId: string): Promise<Partner | null> {
    return await prisma.partner.findFirst({
      where: { id, userId },
      include: {
        transactions: true,
        children: true,
        parent: true,
      },
    });
  }

  async createPartner(data: Prisma.PartnerUncheckedCreateInput): Promise<Partner> {
    return await prisma.partner.create({
      data,
    });
  }

  async updatePartner(
    id: string,
    userId: string,
    data: Prisma.PartnerUncheckedUpdateInput,
  ): Promise<Partner> {
    return await prisma.partner.update({
      where: { id, userId },
      data,
    });
  }

  async deletePartner(id: string): Promise<void> {
    await prisma.partner.delete({ where: { id } });
  }

  async findByName(name: string, userId: string): Promise<Partner | null> {
    return prisma.partner.findFirst({
      where: {
        name,
        userId,
      },
    });
  }
}

export const partnerRepository = new PartnerRepository();
