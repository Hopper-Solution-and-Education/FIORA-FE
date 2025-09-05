import { IMembershipProgressRepository } from '../../repositories/membershipProgress.interface';
import { MembershipProgress } from '@prisma/client';
import { prisma } from '@/config';

export class MembershipProgressRepository implements IMembershipProgressRepository {
  async getCurrentMembershipProgress(userId: string): Promise<MembershipProgress> {
    return prisma.membershipProgress.findFirst({ where: { userId }, include: { tier: true } }) as unknown as MembershipProgress;
  }
}

export const membershipProgressRepository = new MembershipProgressRepository();
