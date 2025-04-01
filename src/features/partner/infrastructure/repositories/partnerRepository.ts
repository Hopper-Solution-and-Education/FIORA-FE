import { Partner, Prisma } from '@prisma/client';
import { IPartnerRepository } from '../../domain/repositories/partnerRepository.interface';
import prisma from '@/infrastructure/database/prisma';

class PartnerRepository implements IPartnerRepository {
  async getPartnersByUserId(userId: string): Promise<Partner[]> {
    return await prisma.partner.findMany({
      where: {
        userId: userId,
      },
      include: {
        transactions: true,
        children: true,
        parent: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPartnerById(id: string, userId: string): Promise<Partner | null> {
    return await prisma.partner.findFirst({
      where: { id, userId },
      include: {
        children: true,
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

  // async deletePartner(id: string, userId: string): Promise<Partner> {
  //   // First find the partner to ensure it exists and belongs to the user
  //   const partner = await prisma.partner.findFirst({
  //     where: { id, userId },
  //   });

  //   if (!partner) {
  //     throw new Error('Partner not found');
  //   }

  //   // Update all child partners to have null parentId
  //   await prisma.partner.updateMany({
  //     where: { parentId: id },
  //     data: { parentId: null },
  //   });

  //   // Update all transactions to have null partnerId
  //   await prisma.transaction.updateMany({
  //     where: { partnerId: id },
  //     data: { partnerId: null },
  //   });

  //   // Delete the partner
  //   return await prisma.partner.delete({
  //     where: { id },
  //   });
  // }

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
