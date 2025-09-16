import { prisma } from '@/config';
import { BadRequestError } from '@/shared/lib';
import {
  MembershipBenefitCreatePayload,
  MembershipBenefitCreateUpdateAllPayload,
  MembershipBenefitDeletePayload,
} from '@/shared/types/membership-benefit';
import { v4 as uuid } from 'uuid';
import { membershipBenefitRepository } from '../../infrastructure/repositories/memBenefitRepository';
import { tierBenefitRepository } from '../../infrastructure/repositories/tierBenefitRepository';

class MembershipBenefitService {
  async create(payload: MembershipBenefitCreatePayload, userId: string) {
    const membershipBenefit = await membershipBenefitRepository.createMembershipBenefit({
      id: uuid(),
      ...payload.membershipBenefit,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (!membershipBenefit) {
      throw new BadRequestError('Failed to create MembershipBenefit');
    }

    payload.tierBenefit.benefitId = membershipBenefit.id;
    const tier = await tierBenefitRepository.createTierBenefit(payload.tierBenefit, userId);

    return {
      tierBenefit: tier,
      membershipBenefit,
    } as {
      tierBenefit: typeof tier;
      membershipBenefit: typeof membershipBenefit;
    };
  }

  async delete(id: string) {
    const hasTransaction = await membershipBenefitRepository.existsTransactionUsingBenefit(id);

    if (hasTransaction) {
      throw new BadRequestError(
        'Cannot delete MembershipBenefit because it is in use by a Transaction.',
      );
    }

    return membershipBenefitRepository.deleteMembershipBenefit(id);
  }

  async deleteMembershipBenefitAll(payload: MembershipBenefitDeletePayload) {
    const { slug } = payload;

    return await prisma.$transaction(async (tx) => {
      const foundMembershipBenefit = await tx.membershipBenefit.findUnique({
        where: { slug },
      });

      if (!foundMembershipBenefit) {
        throw new BadRequestError('MembershipBenefit not found');
      }

      const foundMembershipTransactionExists = await tx.transaction.findFirst({
        where: {
          membershipBenefitId: foundMembershipBenefit.id,
          isDeleted: false,
        },
      });

      if (foundMembershipTransactionExists) {
        throw new BadRequestError(
          'Cannot delete MembershipBenefit because it is in use by a Transaction.',
        );
      }

      const deletedMembershipBenefit = await tx.membershipBenefit.delete({
        where: { slug },
      });

      if (!deletedMembershipBenefit) {
        throw new BadRequestError('Failed to delete MembershipBenefit');
      }

      /// get all membership tiers
      const membershipTiers = await tx.membershipTier.findMany();

      if (!membershipTiers) {
        throw new BadRequestError('Failed to get MembershipTiers');
      }

      // delete tier benefit for each membership tier
      const deletedTierBenefits = await tx.tierBenefit.deleteMany({
        where: {
          benefitId: foundMembershipBenefit.id,
          tierId: { in: membershipTiers.map((tier) => tier.id) },
        },
      });

      if (!deletedTierBenefits) {
        throw new BadRequestError('Failed to delete TierBenefit');
      }

      const data = {
        deletedMembershipBenefit,
        deletedTierBenefits,
      };

      return {
        message: 'MembershipBenefit deleted all tiers successfully',
        data,
      } as {
        message: string;
        data: typeof data;
      };
    });
  }

  async deleteMembershipBenefit(payload: MembershipBenefitDeletePayload) {
    const { slug, membershipTierId, membershipBenefitId } = payload;

    return await prisma.$transaction(async (tx) => {
      const foundMembershipBenefit = await tx.membershipBenefit.findUnique({
        where: { slug },
      });

      if (!foundMembershipBenefit) {
        throw new BadRequestError('MembershipBenefit not found');
      }

      if (!membershipTierId || !membershipBenefitId) {
        throw new BadRequestError('MembershipTierId and MembershipBenefitId are required');
      }

      const foundTierBenefit = await tx.tierBenefit.findUnique({
        where: {
          tierId_benefitId: {
            tierId: membershipTierId,
            benefitId: membershipBenefitId,
          },
        },
      });

      if (!foundTierBenefit) {
        throw new BadRequestError('TierBenefit not found with given tierId and benefitId');
      }

      const foundMembershipTransactionExists = await tx.transaction.findFirst({
        where: {
          membershipBenefitId: foundMembershipBenefit.id,
          isDeleted: false,
        },
      });

      if (foundMembershipTransactionExists) {
        throw new BadRequestError(
          'Cannot delete MembershipBenefit because it is in use by a Transaction.',
        );
      }

      const deletedTierBenefit = await tx.tierBenefit.delete({
        where: {
          tierId_benefitId: {
            tierId: membershipTierId,
            benefitId: membershipBenefitId,
          },
        },
      });

      if (!deletedTierBenefit) {
        throw new BadRequestError('Failed to delete TierBenefit');
      }

      return {
        message: 'MembershipBenefit deleted tier successfully',
        data: {
          deletedTierBenefit,
        },
      } as {
        message: string;
        data: { deletedTierBenefit: typeof deletedTierBenefit };
      };
    });
  }

  async createMembershipBenefitAll(payload: MembershipBenefitCreatePayload, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const { tierBenefit, membershipBenefit } = payload;
      const { name, slug, description, suffix } = membershipBenefit;
      const { value } = tierBenefit;

      // get all membership tiers
      const membershipTiers = await tx.membershipTier.findMany();

      if (!membershipTiers) {
        throw new BadRequestError('Failed to get MembershipTiers');
      }

      const createdMembershipBenefit = await tx.membershipBenefit.create({
        data: {
          name,
          slug,
          description,
          suffix,
          userId,
          createdBy: userId,
          updatedAt: new Date(),
          id: uuid(),
        },
      });

      if (!membershipBenefit) {
        throw new BadRequestError('Failed to create MembershipBenefit');
      }

      // create tier benefit for each membership tier
      const createdTierBenefits = await tx.tierBenefit.createManyAndReturn({
        data: membershipTiers.map((membershipTier) => ({
          benefitId: createdMembershipBenefit.id,
          tierId: membershipTier.id,
          value,
          createdBy: userId,
          updatedBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      });

      if (!createdTierBenefits) {
        throw new BadRequestError('Failed to create TierBenefit');
      }

      const data = {
        createdMembershipBenefit,
        createdTierBenefits,
      } as {
        createdMembershipBenefit: typeof createdMembershipBenefit;
        createdTierBenefits: typeof createdTierBenefits;
      };

      return {
        message: 'MembershipBenefit created all tiers successfully',
        data,
      } as {
        message: string;
        data: typeof data;
      };
    });
  }

  async createMembershipBenefit(payload: MembershipBenefitCreatePayload, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const { tierBenefit, membershipBenefit } = payload;
      const { name, slug, description, suffix } = membershipBenefit;
      const { value, tierId } = tierBenefit;

      const createdMembershipBenefit = await tx.membershipBenefit.create({
        data: {
          name,
          slug,
          description,
          suffix,
          userId,
          createdBy: userId,
          updatedBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          id: uuid(),
        },
      });

      if (!createdMembershipBenefit) {
        throw new BadRequestError('Failed to create MembershipBenefit');
      }

      if (!tierId) {
        throw new BadRequestError('TierId is required');
      }

      const createdTierBenefit = await tx.tierBenefit.create({
        data: {
          benefitId: createdMembershipBenefit.id,
          value,
          tierId,
          createdBy: userId,
          updatedBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      if (!createdTierBenefit) {
        throw new BadRequestError('Failed to create TierBenefit');
      }

      const data = {
        createdMembershipBenefit,
        createdTierBenefit,
      } as {
        createdMembershipBenefit: typeof createdMembershipBenefit;
        createdTierBenefit: typeof createdTierBenefit;
      };

      return {
        message: 'MembershipBenefit created tier successfully',
        data,
      } as {
        message: string;
        data: typeof data;
      };
    });
  }

  async updateMembershipBenefitAll(
    payload: MembershipBenefitCreateUpdateAllPayload,
    userId: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      const { membershipBenefit, tierBenefit } = payload;
      const { value } = tierBenefit;
      const { name, slug, description, suffix } = membershipBenefit;

      const foundMembershipBenefit = await tx.membershipBenefit.findUnique({
        where: { slug: payload.membershipBenefit.slug },
      });

      if (!foundMembershipBenefit) {
        throw new BadRequestError('MembershipBenefit not found');
      }

      // update of membership benefit
      const updatedMembershipBenefit = await tx.membershipBenefit.update({
        where: { id: foundMembershipBenefit.id },
        data: {
          name,
          slug,
          description,
          suffix,
          updatedBy: userId,
        },
      });

      if (!updatedMembershipBenefit) {
        throw new BadRequestError('Failed to update MembershipBenefit');
      }

      // get all membership tiers
      const membershipTiers = await tx.membershipTier.findMany();

      if (!membershipTiers) {
        throw new BadRequestError('Failed to get MembershipTiers');
      }

      // update all tier benefits which in the membership tiers
      const updatedTierBenefits = await tx.tierBenefit.updateMany({
        where: {
          AND: [
            { benefitId: foundMembershipBenefit.id },
            { tierId: { in: membershipTiers.map((tier) => tier.id) } },
          ],
        },
        data: {
          value,
          updatedBy: userId,
        },
      });

      if (!updatedTierBenefits) {
        throw new BadRequestError('Failed to update TierBenefit');
      }

      const data = {
        updatedMembershipBenefit,
        updatedTierBenefits,
      } as {
        updatedMembershipBenefit: typeof updatedMembershipBenefit;
        updatedTierBenefits: typeof updatedTierBenefits;
      };

      return {
        message: 'MembershipBenefit updated all tiers successfully',
        data,
      } as {
        message: string;
        data: typeof data;
      };
    });
  }

  async updateMembershipBenefit(payload: MembershipBenefitCreatePayload, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const { tierBenefit, membershipBenefit } = payload;

      const { value, tierId } = tierBenefit;
      const { name, slug, description, suffix } = membershipBenefit;

      const foundMembershipBenefit = await tx.membershipBenefit.findUnique({
        where: { slug },
      });

      if (!foundMembershipBenefit) {
        throw new BadRequestError('MembershipBenefit not found');
      }

      const updatedMembershipBenefit = await tx.membershipBenefit.update({
        where: { id: foundMembershipBenefit.id },
        data: {
          name,
          slug,
          description,
          suffix,
          updatedBy: userId,
        },
      });

      if (!updatedMembershipBenefit) {
        throw new BadRequestError('Failed to update MembershipBenefit');
      }

      if (!tierId) {
        throw new BadRequestError('TierId is required');
      }

      const updatedTierBenefit = await tx.tierBenefit.update({
        where: {
          tierId_benefitId: {
            benefitId: foundMembershipBenefit.id,
            tierId,
          },
        },
        data: {
          value,
          updatedBy: userId,
        },
      });

      if (!updatedTierBenefit) {
        throw new BadRequestError('Failed to update TierBenefit');
      }

      const data = {
        updatedMembershipBenefit,
        updatedTierBenefit,
      } as {
        updatedMembershipBenefit: typeof updatedMembershipBenefit;
        updatedTierBenefit: typeof updatedTierBenefit;
      };

      return {
        message: 'MembershipBenefit updated tier successfully',
        data,
      } as {
        message: string;
        data: typeof data;
      };
    });
  }

  async processMembershipBenefit(payload: MembershipBenefitCreatePayload, userId: string) {
    const { mode } = payload;

    switch (mode) {
      case 'create':
        return await this.createMembershipBenefit(payload, userId);
      case 'update':
        return await this.updateMembershipBenefit(payload, userId);
      case 'update-all':
        return await this.updateMembershipBenefitAll(payload, userId);
      case 'create-all':
        return await this.createMembershipBenefitAll(payload, userId);
      case 'delete':
        return await this.deleteMembershipBenefit({
          slug: payload.slug!,
          membershipTierId: payload.membershipTierId!,
          membershipBenefitId: payload.membershipBenefitId!,
        });
      case 'delete-all':
        return await this.deleteMembershipBenefitAll({
          slug: payload.slug!,
          membershipTierId: payload.membershipTierId!,
          membershipBenefitId: payload.membershipBenefitId!,
        });
    }
  }
}

export const membershipBenefitService = new MembershipBenefitService();
