import { MembershipProgress, Prisma } from '@prisma/client';

export interface IMembershipProgressRepository {
  getCurrentMembershipProgress(
    userId: string,
    options?: Prisma.MembershipProgressFindFirstArgs,
  ): Promise<MembershipProgress>;
}
