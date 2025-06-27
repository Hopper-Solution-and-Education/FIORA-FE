import { prisma } from '@/config';
import { Prisma } from '@prisma/client';
import { IMembershipTierRepository } from '../../repositories/membershipTierRepository';
import { MembershipTierWithBenefit } from '../../repositories/membershipTierRepository';

class MembershipTierRepository implements IMembershipTierRepository {
  async upsertMembershipTier(
    data: Prisma.MembershipTierCreateInput,
    prismaTx?: Prisma.TransactionClient,
  ) {
    const prismaClient = prismaTx || prisma;
    return prismaClient.membershipTier.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  async findMembershipTierById(id: string) {
    return prisma.membershipTier.findUnique({ where: { id } });
  }

  async updateMembershipTier(id: string, data: Prisma.MembershipTierUpdateInput) {
    return prisma.membershipTier.update({ where: { id }, data });
  }

  async deleteMembershipTier(id: string) {
    await prisma.membershipTier.delete({ where: { id } });
  }

  async findMembershipTiersDashboard(
    where?: Prisma.MembershipTierWhereInput,
    options?: Prisma.MembershipTierFindManyArgs,
  ): Promise<MembershipTierWithBenefit[]> {
    return prisma.membershipTier.findMany({
      where,
      ...options,
    }) as unknown as MembershipTierWithBenefit[];
  }

  async findFirstMembershipTier(
    where?: Prisma.MembershipTierWhereInput,
    options?: Prisma.MembershipTierFindFirstArgs,
  ) {
    return prisma.membershipTier.findFirst({ where, ...options });
  }

  async createMembershipTier(
    data: Prisma.MembershipTierCreateInput,
    prismaTx?: Prisma.TransactionClient,
  ) {
    const prismaClient = prismaTx || prisma;
    return prismaClient.membershipTier.create({ data });
  }
}
export const membershipTierRepository = new MembershipTierRepository();
