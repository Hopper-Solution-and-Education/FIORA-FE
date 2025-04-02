import { type Prisma, type Partner } from '@prisma/client';
import { IPartnerRepository } from '../../domain/repositories/partnerRepository.interface';
import prisma from '@/infrastructure/database/prisma';
import { Messages } from '@/shared/constants/message';
import { partnerRepository } from '../../infrastructure/repositories/partnerRepository';
import { ITransactionRepository } from '@/features/transaction/domain/repositories/transactionRepository.interface';
import { transactionRepository } from '@/features/transaction/infrastructure/repositories/transactionRepository';

class PartnerUseCase {
  constructor(
    private partnerRepository: IPartnerRepository,
    private transactionRepository: ITransactionRepository,
  ) {}

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

  async deletePartner(id: string, userId: string, newId?: string): Promise<void> {
    const partner = await this.partnerRepository.getPartnerById(id, userId);
    if (!partner) {
      throw new Error(Messages.PARTNER_NOT_FOUND);
    }

    if (newId) {
      const newPartner = await this.partnerRepository.getPartnerById(newId, userId);
      if (!newPartner) {
        throw new Error(Messages.PARTNER_NOT_FOUND);
      }
      await this.transactionRepository.updateTransactionsPartner(id, newId);
    }

    await this.partnerRepository.deletePartner(id);
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
        // if (parentPartner.children && parentPartner.children.length > 0) {
        //   throw new Error(Messages.INVALID_PARENT_HIERARCHY);
        // }
      }

      // Avoid updating userId to maintain transaction integrity, unless explicitly intended
      const updateData = {
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
        updatedBy: data.userId || userId, // Use provided userId or fallback to current user
      };

      const updatedPartner = await tx.partner.update({
        where: { id, userId },
        data: updateData,
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

      // Check for uniqueness of email, phone, taxNo, identify if provided
      if (data.email) {
        const existingEmail = await tx.partner.findFirst({
          where: { email: data.email as string, userId: data.userId as string },
        });
        if (existingEmail) {
          throw new Error(Messages.PARTNER_EMAIL_EXISTS);
        }
      }

      if (data.phone) {
        const existingPhone = await tx.partner.findFirst({
          where: { phone: data.phone as string, userId: data.userId as string },
        });
        if (existingPhone) {
          throw new Error(Messages.PARTNER_PHONE_EXISTS);
        }
      }

      if (data.taxNo) {
        const existingTaxNo = await tx.partner.findFirst({
          where: { taxNo: data.taxNo as string, userId: data.userId as string },
        });
        if (existingTaxNo) {
          throw new Error(Messages.PARTNER_TAX_EXISTS);
        }
      }

      if (data.identify) {
        const existingIdentify = await tx.partner.findFirst({
          where: { identify: data.identify as string, userId: data.userId as string },
        });
        if (existingIdentify) {
          throw new Error(Messages.PARTNER_IDENTIFY_EXISTS);
        }
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

  async getPartnerById(id: string, userId: string) {
    try {
      // Sử dụng phương thức getPartnerById đã có sẵn trong repository
      const partner = await this.partnerRepository.getPartnerById(id, userId);

      if (!partner) {
        throw new Error(Messages.PARTNER_NOT_FOUND);
      }

      return partner;
    } catch (error) {
      console.error('Error getting partner by ID:', error);
      throw error;
    }
  }

  // async deletePartner(id: string, userId: string): Promise<Partner> {
  //   try {
  //     // First check if the partner exists
  //     const partner = await this.partnerRepository.getPartnerById(id, userId);

  //     if (!partner) {
  //       throw new Error(Messages.PARTNER_NOT_FOUND);
  //     }

  //     // Use the repository to handle the deletion
  //     return await this.partnerRepository.deletePartner(id, userId);
  //   } catch (error) {
  //     console.error('Error deleting partner:', error);
  //     throw error;
  //   }
  // }
}

export const partnerUseCase = new PartnerUseCase(partnerRepository, transactionRepository);
