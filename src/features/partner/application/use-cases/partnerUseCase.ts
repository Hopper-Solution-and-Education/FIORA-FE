import { type Prisma, type Partner } from '@prisma/client';
import { IPartnerRepository } from '../../domain/repositories/partnerRepository.interface';
import prisma from '@/infrastructure/database/prisma';
import { Messages } from '@/shared/constants/message';
import { partnerRepository } from '../../infrastructure/repositories/partnerRepository';

class PartnerUseCase {
  constructor(private partnerRepository: IPartnerRepository) {}

  async listPartners(userId: string): Promise<Partner[]> {
    return this.partnerRepository.getPartnersByUserId(userId);
  }

  async viewPartner(id: string, userId: string): Promise<Partner> {
    const partner = await this.partnerRepository.getPartnerById(id, userId);
    if (!partner) {
      throw new Error(Messages.PARTNER_NOT_FOUND);
    }
    return partner;
  }

  async editPartner(
    id: string,
    userId: string,
    data: Prisma.PartnerUncheckedUpdateInput,
  ): Promise<Partner> {
    return prisma.$transaction(async (tx) => {
      const partner = await tx.partner.findUnique({
        where: { id, userId },
      });
      if (!partner) {
        throw new Error(Messages.PARTNER_NOT_FOUND);
      }

      if (data.parentId) {
        const parentPartner = await tx.partner.findUnique({
          where: { id: data.parentId as string },
          include: { children: true },
        });
        if (!parentPartner) {
          throw new Error(Messages.PARENT_PARTNER_NOT_FOUND);
        }
        if (parentPartner.id === partner.id) {
          throw new Error(Messages.INVALID_PARENT_PARTNER_SELF);
        }
        if (parentPartner.children && parentPartner.children.length > 0) {
          throw new Error(Messages.INVALID_PARENT_HIERARCHY);
        }
      }

      const updatedPartner = await tx.partner.update({
        where: { id, userId },
        data: {
          userId: data.userId,
          email: data.email,
          identify: data.identify,
          description: data.description,
          dob: data.dob ? new Date(data.dob as string) : undefined,
          logo: data.logo,
          taxNo: data.taxNo,
          phone: data.phone,
          name: data.name,
          address: data.address,
          parentId: data.parentId,
          createdBy: data.userId,
          updatedBy: data.userId,
        },
      });
      if (!updatedPartner) {
        throw new Error(Messages.UPDATE_PARTNER_FAILED);
      }

      return updatedPartner;
    });
  }

  async createPartner(data: Prisma.PartnerUncheckedCreateInput): Promise<Partner> {
    return prisma.$transaction(async (tx) => {
      if (!data.userId) {
        throw new Error(Messages.INVALID_USER);
      }

      if (data.phone && data.phone.length < 10) {
        throw new Error(Messages.INVALID_PHONE);
      }

      if (data.dob && new Date(data.dob) > new Date()) {
        throw new Error(Messages.INVALID_DOB);
      }

      if (data.parentId) {
        const parentPartner = await tx.partner.findUnique({
          where: { id: data.parentId },
          select: { parentId: true },
        });
        if (parentPartner?.parentId) {
          throw new Error(Messages.INVALID_PARENT_HIERARCHY);
        }
      }

      const partner = await tx.partner.create({
        data: {
          userId: data.userId,
          email: data.email,
          identify: data.identify,
          description: data.description,
          dob: data.dob,
          logo: data.logo,
          taxNo: data.taxNo,
          phone: data.phone,
          name: data.name,
          address: data.address,
          createdBy: data.userId,
          updatedBy: data.userId,
          parentId: data.parentId || null,
        },
      });

      if (!partner) {
        throw new Error(Messages.CREATE_PARTNER_FAILED);
      }

      return partner;
    });
  }
}

export const partnerUseCase = new PartnerUseCase(partnerRepository);
