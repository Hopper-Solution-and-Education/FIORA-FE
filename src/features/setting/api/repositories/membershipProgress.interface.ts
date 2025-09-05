import { MembershipProgress } from '@prisma/client';

export interface IMembershipProgressRepository {
  getCurrentMembershipProgress(userId: string): Promise<MembershipProgress>;
}
