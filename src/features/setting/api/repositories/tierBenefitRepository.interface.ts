import { TierBenefit as TierBenefitScheme } from '@/shared/types/membership-benefit';
import { TierBenefit } from '@prisma/client';

export interface ITierBenefitRepository {
  findTierBenefitsByTierId(tierId: string): Promise<TierBenefit[]>;
  createTierBenefit(tierBenefit: TierBenefitScheme, userId: string): Promise<TierBenefit>;
}
