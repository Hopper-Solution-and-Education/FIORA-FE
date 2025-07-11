import { MembershipBenefit, Prisma } from '@prisma/client';

export interface IMembershipBenefitRepository {
  createMembershipBenefit(
    data: Prisma.MembershipBenefitUncheckedCreateInput,
  ): Promise<MembershipBenefit>;

  updateMembershipBenefit(
    id: string,
    data: Prisma.MembershipBenefitUncheckedUpdateInput,
  ): Promise<MembershipBenefit>;

  existsTransactionUsingBenefit(benefitId: string): Promise<boolean>;

  deleteMembershipBenefit(id: string): Promise<MembershipBenefit>;
}
