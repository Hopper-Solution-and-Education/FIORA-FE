import { TierBenefit } from '../domain/entities';
import { TierRankData } from '../presentation/molecules';

export * from './membershipTierUtils';

export const mapTierBenefits = (benefits: TierBenefit[]): TierRankData[] => {
  return benefits.map((benefit) => ({
    label: benefit.name,
    value: benefit.value.toString(),
    suffix: benefit.suffix ?? '',
  }));
};
