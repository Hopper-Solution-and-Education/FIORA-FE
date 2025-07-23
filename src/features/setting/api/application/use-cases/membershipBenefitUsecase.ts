import { MembershipBenefitCreatePayload } from '@/shared/types/membership-benefit';
import { v4 as uuid } from 'uuid';
import { membershipBenefitRepository } from '../../infrastructure/repositories/memBenefitRepository';
import { tierBenefitRepository } from '../../infrastructure/repositories/tierBenefitRepository';

class MembershipBenefitService {
  async create(payload: MembershipBenefitCreatePayload, userId: string) {
    payload.membershipBenefit.slug = `${payload.membershipBenefit.slug}-${Date.now()}`;
    const membershipBenefit = await membershipBenefitRepository.createMembershipBenefit({
      id: uuid(),
      ...payload.membershipBenefit,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if (!membershipBenefit) {
      throw new Error('Failed to create MembershipBenefit');
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
      throw new Error('Cannot delete MembershipBenefit because it is in use by a Transaction.');
    }

    return membershipBenefitRepository.deleteMembershipBenefit(id);
  }
}

export const membershipBenefitService = new MembershipBenefitService();
