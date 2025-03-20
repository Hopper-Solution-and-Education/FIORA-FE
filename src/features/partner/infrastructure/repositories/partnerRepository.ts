import { Partner, Prisma } from '@prisma/client';
import { IPartnerRepository } from '../../domain/repositories/partnerRepository.interface';
import prisma from '@/infrastructure/database/prisma';

class PartnerRepository implements IPartnerRepository {
  async getPartnersByUserId(userId: string): Promise<Partner[]> {
    return await prisma.partner.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPartnerById(id: string, userId: string): Promise<Partner | null> {
    return await prisma.partner.findFirst({
      where: { id, userId },
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
