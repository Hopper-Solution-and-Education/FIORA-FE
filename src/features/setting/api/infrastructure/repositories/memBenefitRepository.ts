import { prisma } from '@/config';
import { MembershipBenefit, Prisma } from '@prisma/client';
import { IMembershipBenefitRepository } from '../../repositories/memBenefitRepository.interface';

class MembershipBenefitRepository implements IMembershipBenefitRepository {
  async createMembershipBenefit(
    data: Prisma.MembershipBenefitUncheckedCreateInput,
  ): Promise<MembershipBenefit> {
    return prisma.membershipBenefit.create({ data });
  }

  async updateMembershipBenefit(
    id: string,
    data: Prisma.MembershipBenefitUncheckedUpdateInput,
  ): Promise<MembershipBenefit> {
    return prisma.membershipBenefit.update({ where: { id }, data });
  }

  async existsTransactionUsingBenefit(benefitId: string): Promise<boolean> {
    const count = await prisma.transaction.count({
      where: {
        membershipBenefitId: benefitId,
        isDeleted: false,
      },
    });

    return count > 0;
  }

  async deleteMembershipBenefit(id: string): Promise<MembershipBenefit> {
    return prisma.membershipBenefit.delete({
      where: { id },
    });
  }
}

export const membershipBenefitRepository = new MembershipBenefitRepository();
