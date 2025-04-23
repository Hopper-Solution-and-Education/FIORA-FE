import { prisma } from '@/config';
import { Partner, Prisma } from '@prisma/client';
import { IPartnerRepository } from '../../domain/repositories/partnerRepository.interface';

class PartnerRepository implements IPartnerRepository {
  async getPartnersByUserId(userId: string): Promise<Partner[]> {
    return await prisma.partner.findMany({
      where: {
        userId: userId,
        transactions: { some: { isDeleted: false } },
      },
      include: {
        transactions: true,
        children: true,
        parent: true,
      },
      orderBy: { transactions: { _count: 'desc' } },
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
