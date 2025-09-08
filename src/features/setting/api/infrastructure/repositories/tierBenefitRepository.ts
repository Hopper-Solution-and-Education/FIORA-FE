import prisma from '@/config/prisma/prisma';
import { TierBenefit as TierBenefitScheme } from '@/shared/types/membership-benefit';
import { TierBenefit } from '@prisma/client';
import { ITierBenefitRepository } from '../../repositories/tierBenefitRepository.interface';

class TierBenefitRepository implements ITierBenefitRepository {
  async findTierBenefitsByTierId(tierId: string): Promise<TierBenefit[]> {
    return prisma.tierBenefit.findMany({
      where: { tierId },
    });
  }

  async createTierBenefit(tierBenefit: TierBenefitScheme, userId: string): Promise<TierBenefit> {
    if (!tierBenefit.tierId || !tierBenefit.benefitId) {
      throw new Error('tierId and benefitId are required');
    }

    return prisma.tierBenefit.create({
      data: {
        tierId: tierBenefit.tierId,
        benefitId: tierBenefit.benefitId,
        value: tierBenefit.value,
        createdBy: userId,
        updatedBy: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}

export const tierBenefitRepository = new TierBenefitRepository();
