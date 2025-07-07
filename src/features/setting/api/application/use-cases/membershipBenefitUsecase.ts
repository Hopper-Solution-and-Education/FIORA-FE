import {
  MembershipBenefitCreatePayload,
  MembershipBenefitUpdatePayload,
} from '@/shared/types/membership-benefit';
import { v4 as uuid } from 'uuid';
import { membershipBenefitRepository } from '../../infrastructure/repositories/memBenefitRepository';

class MembershipBenefitService {
  async create(payload: MembershipBenefitCreatePayload, userId: string) {
    return membershipBenefitRepository.createMembershipBenefit({
      id: uuid(),
      ...payload,
      createdBy: userId,
      updatedBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async update(payload: MembershipBenefitUpdatePayload, userId: string) {
    return membershipBenefitRepository.updateMembershipBenefit(payload.id!, {
      ...payload,
      updatedBy: userId,
      updatedAt: new Date(),
    });
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
