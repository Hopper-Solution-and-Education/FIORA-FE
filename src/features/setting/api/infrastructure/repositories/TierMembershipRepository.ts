import { prisma } from '@/config';
import { MembershipProgress } from '@prisma/client';
import { IMembershipProgressRepository } from '../../repositories/membershipProgress.interface';

export class MembershipProgressRepository implements IMembershipProgressRepository {
  async getCurrentMembershipProgress(userId: string): Promise<MembershipProgress> {
    return prisma.membershipProgress.findFirst({
      where: { userId },
    }) as unknown as MembershipProgress;
  }
}

export const membershipProgressRepository = new MembershipProgressRepository();
