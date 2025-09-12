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

  fetchMembershipBenefit(
    where: Prisma.MembershipBenefitWhereInput,
    options?: Prisma.MembershipBenefitFindFirstArgs,
  ): Promise<MembershipBenefit | null>;

  deleteMembershipBenefit(id: string): Promise<MembershipBenefit>;

  findMembershipBenefitBySlug(slug: string): Promise<MembershipBenefit | null>;
}
