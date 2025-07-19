import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import { MembershipTier, Prisma } from '@prisma/client';
import { membershipTierRepository } from '../../infrastructure/repositories/membershipTierRepository';
import {
  IMembershipTierRepository,
  MembershipTierCreation,
  MembershipTierWithBenefit,
} from '../../repositories/membershipTierRepository';

class MembershipSettingUseCase {
  private readonly membershipTierRepository: IMembershipTierRepository;

  constructor(membershipTierRepository: IMembershipTierRepository) {
    this.membershipTierRepository = membershipTierRepository;
  }

  async upsertMembershipTier(data: MembershipTierCreation, userId: string) {
    const {
      id,
      tierName,
      spentMinThreshold,
      spentMaxThreshold,
      balanceMinThreshold,
      balanceMaxThreshold,
      tierBenefits,
      inactiveIconUrl,
      mainIconUrl,
      passedIconUrl,
      themeIconUrl,
      story,
    } = data;

    try {
      const newTierBenefits: Array<{
        id: string;
        slug: string;
        name: string;
        suffix: string;
        description: string;
        value: number;
      }> = [];

      return await prisma.$transaction(
        async (tx) => {
          const updatedMembershipTier = await tx.membershipTier.upsert({
            where: { id },
            update: {
              updatedBy: userId,
              ...(inactiveIconUrl && { inactiveIconUrl }),
              ...(mainIconUrl && { mainIconUrl }),
              ...(passedIconUrl && { passedIconUrl }),
              ...(themeIconUrl && { themeIconUrl }),
              ...(story && { story }),
              ...(tierName && { tierName }),
            },
            create: {
              tierName,
              createdBy: userId,
              userId,
              spentMinThreshold: spentMinThreshold
                ? new Prisma.Decimal(Number(spentMinThreshold))
                : new Prisma.Decimal(0),
              spentMaxThreshold: spentMaxThreshold
                ? new Prisma.Decimal(Number(spentMaxThreshold))
                : new Prisma.Decimal(0),
              balanceMinThreshold: balanceMinThreshold
                ? new Prisma.Decimal(Number(balanceMinThreshold))
                : new Prisma.Decimal(0),
              balanceMaxThreshold: balanceMaxThreshold
                ? new Prisma.Decimal(Number(balanceMaxThreshold))
                : new Prisma.Decimal(0),
              ...(inactiveIconUrl && { inactiveIconUrl }),
              ...(mainIconUrl && { mainIconUrl }),
              ...(passedIconUrl && { passedIconUrl }),
              ...(themeIconUrl && { themeIconUrl }),
              ...(story && { story }),
            },
          });

          if (!updatedMembershipTier) {
            throw new Error(Messages.MEMBERSHIP_TIER_CREATE_FAILED);
          }

          // Create many - many table relationship of tierBenefits with membershipBenefit
          if (tierBenefits.length > 0) {
            const tierBenefitPromises = tierBenefits.map(async (benefit) => {
              const membershipBenefit = await tx.membershipBenefit.findUnique({
                where: { slug: benefit.slug },
                select: { id: true },
              });

              if (!membershipBenefit) {
                throw new Error(Messages.MEMBERSHIP_BENEFIT_SLUG_NAME_NOT_FOUND);
              }

              const newTierBenefit = await tx.tierBenefit.upsert({
                where: {
                  tierId_benefitId: {
                    tierId: updatedMembershipTier.id,
                    benefitId: membershipBenefit.id,
                  },
                },
                create: {
                  tierId: updatedMembershipTier.id,
                  benefitId: membershipBenefit.id,
                  value: new Prisma.Decimal(Number(benefit.value)),
                  createdBy: userId,
                },
                update: {
                  value: new Prisma.Decimal(Number(benefit.value)),
                  updatedBy: userId,
                },
                include: {
                  benefit: {
                    select: {
                      id: true,
                      slug: true,
                      name: true,
                      suffix: true,
                      description: true,
                    },
                  },
                },
              });

              if (!newTierBenefit) {
                throw new Error(Messages.MEMBERSHIP_TIER_BENEFIT_CREATE_FAILED);
              }

              if (!newTierBenefit) {
                throw new Error(Messages.MEMBERSHIP_TIER_BENEFIT_CREATE_FAILED);
              }

              const newTierBenefitWithBenefit = {
                id: newTierBenefit.benefit.id,
                slug: newTierBenefit.benefit.slug,
                name: newTierBenefit.benefit.name,
                suffix: newTierBenefit.benefit.suffix || '',
                description: newTierBenefit.benefit.description || '',
                value: Number(newTierBenefit.value),
              };
              return newTierBenefitWithBenefit;
            });

            newTierBenefits.push(...(await Promise.all(tierBenefitPromises)));
          }

          return {
            ...updatedMembershipTier,
            tierBenefits: newTierBenefits,
          };
        },
        { maxWait: 10000, timeout: 15000 },
      );
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(Messages.MEMBERSHIP_TIER_ALREADY_EXISTS);
        } else {
          throw new Error(error.message || Messages.INTERNAL_ERROR);
        }
      }
      throw new Error(error.message || Messages.INTERNAL_ERROR);
    }
  }

  async getMembershipTiersDashboard() {
    try {
      const memberShipList = (await membershipTierRepository.findMembershipTiersDashboard(
        {},
        {
          include: {
            tierBenefits: {
              select: {
                value: true,
                benefit: {
                  select: {
                    id: true,
                    slug: true,
                    name: true,
                    suffix: true,
                    description: true,
                  },
                },
              },
            },
          },
          omit: {
            userId: true,
            createdAt: true,
            updatedAt: true,
            createdBy: true,
            updatedBy: true,
          },
          orderBy: [{ balanceMinThreshold: 'asc' }, { spentMinThreshold: 'asc' }],
        },
      )) as MembershipTierWithBenefit[];

      // flat-map the memberShipList to get the tierBenefits
      const memberShipListWithBenefit = memberShipList.map((memberShip) => {
        return {
          ...memberShip,
          balanceMaxThreshold: Number(memberShip.balanceMaxThreshold),
          balanceMinThreshold: Number(memberShip.balanceMinThreshold),
          spentMaxThreshold: Number(memberShip.spentMaxThreshold),
          spentMinThreshold: Number(memberShip.spentMinThreshold),
          tierBenefits: memberShip.tierBenefits.map((tierBenefit) => ({
            ...tierBenefit.benefit,
            value: tierBenefit.value,
          })),
        };
      });

      return memberShipListWithBenefit;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.INTERNAL_ERROR);
    }
  }

  async getMembershipTierById(id: string) {
    return this.membershipTierRepository.findMembershipTierById(id);
  }

  async updateMembershipTier(id: string, data: Partial<MembershipTier>) {
    if (!id) {
      throw new Error('Id is required');
    }

    return this.membershipTierRepository.updateMembershipTier(id, data);
  }

  async deleteMembershipTier(id: string) {
    return this.membershipTierRepository.deleteMembershipTier(id);
  }

  async getCurrentMembershipTier(userId: string) {
    try {
      const foundCurrentMemberShipProgress = await prisma.membershipProgress.findFirst({
        where: {
          userId,
        },
        select: {
          currentSpent: true,
          currentBalance: true,
        },
      });

      let currentSpent = 0;
      let currentBalance = 0;

      if (!foundCurrentMemberShipProgress) {
        const createdCurrentMemberShipProgress = await prisma.membershipProgress.create({
          data: {
            userId,
            currentSpent: new Prisma.Decimal(0),
            currentBalance: new Prisma.Decimal(0),
          },
        });

        currentSpent = Number(createdCurrentMemberShipProgress.currentSpent);
        currentBalance = Number(createdCurrentMemberShipProgress.currentBalance);
      } else {
        currentSpent = Number(foundCurrentMemberShipProgress.currentSpent);
        currentBalance = Number(foundCurrentMemberShipProgress.currentBalance);
      }

      const restOptions = {
        include: {
          tierBenefits: {
            select: {
              value: true,
              benefit: {
                select: {
                  slug: true,
                  name: true,
                  suffix: true,
                  description: true,
                },
              },
            },
          },
        },
        omit: {
          userId: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
        },
      } as const;

      // fetch membership tiers of current user with (Spending Tier) and (Balance Tier) & Current tier
      const currentTierAwaited = prisma.membershipTier.findFirst({
        where: {
          AND: [
            { spentMinThreshold: { lte: new Prisma.Decimal(currentSpent) } },
            { spentMaxThreshold: { gte: new Prisma.Decimal(currentSpent) } },
            { balanceMinThreshold: { lte: new Prisma.Decimal(currentBalance) } },
            { balanceMaxThreshold: { gte: new Prisma.Decimal(currentBalance) } },
          ],
        },
        orderBy: [{ spentMinThreshold: 'desc' }, { balanceMinThreshold: 'desc' }],
        ...restOptions,
      });

      // fetch current membership progress
      const currentMembershipProgressAwaited = prisma.membershipProgress.findFirst({
        where: {
          userId,
        },
        select: {
          currentSpent: true,
          currentBalance: true,
        },
      });

      // Notes: Next spending tier is the tier that has higher spentMinThreshold but same balance range as current tier
      const nextSpendingTierAwaited = prisma.membershipTier.findFirst({
        where: {
          AND: [
            { spentMinThreshold: { gt: new Prisma.Decimal(currentSpent) } },
            { balanceMinThreshold: { lte: new Prisma.Decimal(currentBalance) } },
            { balanceMaxThreshold: { gte: new Prisma.Decimal(currentBalance) } },
          ],
        },
        orderBy: [{ spentMinThreshold: 'asc' }],
        ...restOptions,
      });

      // Notes: Next balance tier is the tier that has higher balanceMinThreshold but same spent range as current tier
      const nextBalanceTierAwaited = prisma.membershipTier.findFirst({
        where: {
          AND: [
            { balanceMinThreshold: { gt: new Prisma.Decimal(currentBalance) } },
            { spentMinThreshold: { lte: new Prisma.Decimal(currentSpent) } },
            { spentMaxThreshold: { gte: new Prisma.Decimal(currentSpent) } },
          ],
        },
        orderBy: [{ balanceMinThreshold: 'asc' }],
        ...restOptions,
      });

      const [currentTier, nextSpendingTier, nextBalanceTier, currentMembershipProgress] =
        await Promise.all([
          currentTierAwaited,
          nextSpendingTierAwaited,
          nextBalanceTierAwaited,
          currentMembershipProgressAwaited,
        ]);

      // flat-map the currentTier to get the tierBenefits
      const currentTierWithBenefit = {
        ...currentTier,
        tierBenefits: currentTier?.tierBenefits.map((tierBenefit) => ({
          ...tierBenefit.benefit,
          value: tierBenefit.value,
        })),
      };

      const nextSpendingTierWithBenefit = {
        ...nextSpendingTier,
        tierBenefits: nextSpendingTier?.tierBenefits.map((tierBenefit) => ({
          ...tierBenefit.benefit,
          value: tierBenefit.value,
        })),
      };

      const nextBalanceTierWithBenefit = {
        ...nextBalanceTier,
        tierBenefits: nextBalanceTier?.tierBenefits.map((tierBenefit) => ({
          ...tierBenefit.benefit,
          value: tierBenefit.value,
        })),
      };

      return {
        currentSpent: currentMembershipProgress?.currentSpent.toNumber() ?? 0,
        currentBalance: currentMembershipProgress?.currentBalance.toNumber() ?? 0,
        currentTier: currentTierWithBenefit ?? [],
        nextSpendingTier: nextSpendingTierWithBenefit ?? [],
        nextBalanceTier: nextBalanceTierWithBenefit ?? [],
      };
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : Messages.INTERNAL_ERROR);
    }
  }

  async createNewMembershipProgress(userId: string) {
    return prisma.membershipProgress.create({
      data: {
        userId,
        currentSpent: new Prisma.Decimal(0),
        currentBalance: new Prisma.Decimal(0),
        createdBy: userId,
      },
    });
  }
}

export const membershipSettingUseCase = new MembershipSettingUseCase(membershipTierRepository);
