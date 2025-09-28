import { TierBenefit as TierBenefitScheme } from '@/shared/types/membership-benefit';
import { Prisma, TierBenefit } from '@prisma/client';

export interface ITierBenefitRepository {
  findTierBenefitsByTierId(tierId: string): Promise<TierBenefit[]>;
  createTierBenefit(tierBenefit: TierBenefitScheme, userId: string): Promise<TierBenefit>;
  findTierBenefit(
    where: Prisma.TierBenefitWhereInput,
    options?: Prisma.TierBenefitFindFirstArgs,
  ): Promise<TierBenefit | null>;
}
