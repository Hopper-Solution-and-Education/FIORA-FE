import { type Prisma, type Partner } from '@prisma/client';
import { IPartnerRepository } from '../../domain/repositories/partnerRepository.interface';
import { Messages } from '@/lib/message';
import prisma from '@/infrastructure/database/prisma';
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
      const partner = await this.partnerRepository.getPartnerById(id, userId);
      if (!partner) {
        throw new Error(Messages.PARTNER_NOT_FOUND);
      }

      if (data.name && data.name !== partner.name) {
        const existingPartner = await this.partnerRepository.findByName(
          data.name as string,
          userId,
        );
        if (existingPartner) {
          throw new Error(Messages.PARTNER_NAME_TAKEN);
        }
      }

      const updatedPartner = await this.partnerRepository.updatePartner(id, userId, {
        userId: data.userId,
        email: data.email,
        identify: data.identify,
        description: data.description,
        dob: new Date(data.dob as string),
        logo: data.logo,
        taxNo: data.taxNo,
        phone: data.phone,
        name: data.name,
        address: data.address,
        createdBy: data.userId,
        updatedBy: data.userId,
      });
      if (!updatedPartner) {
        throw new Error(Messages.UPDATE_PARTNER_FAILED);
      }

      return updatedPartner;
    });
  }

  async createPartner(data: Prisma.PartnerUncheckedCreateInput): Promise<Partner> {
    return prisma.$transaction(async () => {
      if (!data.userId) {
        throw new Error(Messages.INVALID_USER);
      }

      const existingPartner = await this.partnerRepository.findByName(data.name, data.userId);
      if (existingPartner) {
        throw new Error(Messages.PARTNER_ALREADY_EXISTS);
      }

      if (!data.phone || data.phone.length < 10) {
        throw new Error(Messages.INVALID_PHONE);
      }

      if (!data.dob || new Date(data.dob) > new Date()) {
        throw new Error(Messages.INVALID_DOB);
      }

      const partner = await this.partnerRepository.createPartner({
        userId: data.userId,
        email: data.email,
        identify: data.identify,
        description: data.description,
        dob: new Date(data.dob),
        logo: data.logo,
        taxNo: data.taxNo,
        phone: data.phone,
        name: data.name,
        address: data.address,
        createdBy: data.userId,
        updatedBy: data.userId,
      });

      if (!partner) {
        throw new Error(Messages.CREATE_PARTNER_FAILED);
      }

      return partner;
    });
  }
}

export const partnerUseCase = new PartnerUseCase(partnerRepository);
