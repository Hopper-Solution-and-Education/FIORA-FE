import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import { BadRequestError, ConflictError } from '@/shared/lib';
import { Prisma } from '@prisma/client';
import { membershipTierRepository } from '../../infrastructure/repositories/membershipTierRepository';
import { userRepository } from '../../infrastructure/repositories/userRepository';
import {
  Axis,
  IMembershipTierRepository,
  MembershipTierCreation,
  MembershipTierUpdate,
  MembershipTierWithBenefit,
  Range,
  RangeKeys,
  TierInfinityParams,
  UserInfinityResult,
} from '../../repositories/membershipTierRepository';
import { IUserRepository } from '../../repositories/userRepository.interface';

function axisKeys(axis: Axis): RangeKeys {
  return axis === 'spent'
    ? { minKey: 'spentMinThreshold', maxKey: 'spentMaxThreshold' }
    : { minKey: 'balanceMinThreshold', maxKey: 'balanceMaxThreshold' };
}

function overlapWhere(axis: Axis, newMin: number, newMax: number) {
  const { minKey, maxKey } = axisKeys(axis);
  return {
    NOT: {
      OR: [
        { [minKey]: { gt: new Prisma.Decimal(newMax) } }, // entirely right
        { [maxKey]: { lt: new Prisma.Decimal(newMin) } }, // entirely left
      ],
    },
  } as any;
}

const rng = (min: any, max: any): Range => ({ min: Number(min), max: Number(max) });

class MembershipSettingUseCase {
  private readonly membershipTierRepository: IMembershipTierRepository;
  private readonly userRepository: IUserRepository;
  constructor(
    membershipTierRepository: IMembershipTierRepository,
    userRepository: IUserRepository,
  ) {
    this.membershipTierRepository = membershipTierRepository;
    this.userRepository = userRepository;
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
            throw new BadRequestError(Messages.MEMBERSHIP_TIER_CREATE_FAILED);
          }

          // Create many - many table relationship of tierBenefits with membershipBenefit
          if (tierBenefits.length > 0) {
            const tierBenefitPromises = tierBenefits.map(async (benefit) => {
              const membershipBenefit = await tx.membershipBenefit.findUnique({
                where: { slug: benefit.slug },
                select: { id: true },
              });

              if (!membershipBenefit) {
                throw new BadRequestError(Messages.MEMBERSHIP_BENEFIT_SLUG_NAME_NOT_FOUND);
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
                throw new BadRequestError(Messages.MEMBERSHIP_TIER_BENEFIT_CREATE_FAILED);
              }

              if (!newTierBenefit) {
                throw new BadRequestError(Messages.MEMBERSHIP_TIER_BENEFIT_CREATE_FAILED);
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
          throw new BadRequestError(Messages.MEMBERSHIP_TIER_ALREADY_EXISTS);
        } else {
          throw new BadRequestError(error.message || Messages.INTERNAL_ERROR);
        }
      }
      throw new BadRequestError(error.message || Messages.INTERNAL_ERROR);
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
      throw new BadRequestError(error instanceof Error ? error.message : Messages.INTERNAL_ERROR);
    }
  }

  async getMembershipTierById(id: string) {
    return this.membershipTierRepository.findMembershipTierById(id);
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
      throw new BadRequestError(error instanceof Error ? error.message : Messages.INTERNAL_ERROR);
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

  async updateMembershipThreshold(data: MembershipTierUpdate, userId: string) {
    const FLOOR = 0;
    const CEILING = 99999999999;

    const { axis, oldMin, oldMax, newMin, newMax } = data;
    const { minKey, maxKey } = axisKeys(axis);

    const dOldMin = new Prisma.Decimal(oldMin);
    const dOldMax = new Prisma.Decimal(oldMax);
    const dNewMin = new Prisma.Decimal(newMin);
    const dNewMax = new Prisma.Decimal(newMax);

    const dFloor = new Prisma.Decimal(FLOOR);
    const dCeil = new Prisma.Decimal(CEILING);

    if (dOldMin.lt(dFloor) || dOldMax.gt(dCeil)) {
      throw new BadRequestError(
        'Old min must be greater than 0 and old max must be less than 99999999999',
      );
    }

    // Not allowed to update new min to be less than old min
    if (dNewMin.lt(dOldMin)) {
      throw new BadRequestError('New min must be greater than old min');
    }

    const targetCount = await prisma.membershipTier.count({
      where: { [minKey]: dOldMin, [maxKey]: dOldMax } as any,
    });

    if (targetCount === 0) {
      throw new BadRequestError('Membership tier not found (old range)');
    }

    // Find overlap tier ranges & exclude the current target tier
    const overlapTiers = await prisma.membershipTier.findMany({
      where: {
        ...overlapWhere(axis, newMin, newMax),
      },
      select: { [minKey]: true, [maxKey]: true },
      distinct: [minKey, maxKey], // unique axis pairs only
      orderBy: { [minKey]: 'asc' },
    });

    // If it would touch > 1 distinct neighbor tiers (on the same axis)
    if (overlapTiers.length > 3) {
      throw new BadRequestError('Change would affect more than one neighboring tier; rejected.');
    }

    // Identify immediate neighbors by current edges
    const nextMinOld = oldMax + 1;
    const prevMaxOld = oldMin - 1;

    // Fetch immediate neighbors
    const [nextNeighbor, prevNeighbor] = await Promise.all([
      prisma.membershipTier.findFirst({
        where: { [minKey]: new Prisma.Decimal(nextMinOld) },
        select: { [minKey]: true, [maxKey]: true },
        orderBy: { [maxKey]: 'desc' }, // not strictly needed, but deterministic
      }),
      prevMaxOld >= 0
        ? prisma.membershipTier.findFirst({
          where: { [maxKey]: new Prisma.Decimal(prevMaxOld) },
          select: { [minKey]: true, [maxKey]: true },
          orderBy: { [minKey]: 'asc' },
        })
        : Promise.resolve(null),
    ]);

    // 2) Validate snaps don’t invert neighbors or ripple past the second neighbor
    //    - Next: min becomes newMax+1, must be <= its max and < secondNext.min
    //    - Prev: max becomes newMin-1, must be >= its min and > secondPrev.max
    if (nextNeighbor) {
      const next = rng((nextNeighbor as any)[minKey], (nextNeighbor as any)[maxKey]);
      const snappedNextMin = newMax + 1;
      if (snappedNextMin > next.max) {
        throw new ConflictError('Next tier would become invalid after snap (min > max).');
      }
      // second next (smallest min greater than next.min)
      const secondNext = await prisma.membershipTier.findFirst({
        where: {
          [minKey]: { gt: new Prisma.Decimal(next.min) },
        } as any,
        select: { [minKey]: true },
        orderBy: { [minKey]: 'asc' } as any,
      });
      if (secondNext) {
        const secondNextMin = Number((secondNext as any)[minKey]);
        if (snappedNextMin >= secondNextMin) {
          throw new ConflictError('Change would ripple beyond the immediate next tier; rejected.');
        }
      }
    }

    if (prevNeighbor) {
      const prev = rng((prevNeighbor as any)[minKey], (prevNeighbor as any)[maxKey]);
      const snappedPrevMax = newMin - 1;
      if (snappedPrevMax < prev.min) {
        throw new ConflictError('Previous tier would become invalid after snap (max < min).');
      }
      // second prev (largest max smaller than prev.max)
      const secondPrev = await prisma.membershipTier.findFirst({
        where: {
          [maxKey]: { lt: new Prisma.Decimal(prev.max) },
        } as any,
        select: { [maxKey]: true },
        orderBy: { [maxKey]: 'desc' } as any,
      });
      if (secondPrev) {
        const secondPrevMax = Number((secondPrev as any)[maxKey]);
        if (snappedPrevMax <= secondPrevMax) {
          throw new ConflictError(
            'Change would ripple beyond the immediate previous tier; rejected.',
          );
        }
      }

      return await prisma.$transaction(async (tx) => {
        const updated = await tx.membershipTier.updateMany({
          where: { [minKey]: dOldMin, [maxKey]: dOldMax },
          data: { [minKey]: dNewMin, [maxKey]: dNewMax, updatedBy: userId },
        });

        if (updated.count === 0) {
          return { updated: 0, snappedNext: 0, snappedPrev: 0 };
        }

        const snapNext = await tx.membershipTier.updateMany({
          where: { [minKey]: new Prisma.Decimal(nextMinOld) },
          data: { [minKey]: dNewMax.add(1), updatedBy: userId },
        });

        const snapPrev =
          oldMin > 0
            ? await tx.membershipTier.updateMany({
              where: { [maxKey]: new Prisma.Decimal(prevMaxOld) },
              data: { [maxKey]: dNewMin.sub(1), updatedBy: userId },
            })
            : { count: 0 };

        return {
          updated: updated.count,
          snapNext: snapNext.count,
          snapPrev: snapPrev.count,
        };
      });
    }
  }

  async getTierInfinity(params: TierInfinityParams): Promise<UserInfinityResult> {
    const { limit = 20, search, page } = params;

    const whereClause: any = {};

    if (search && search.trim().length > 0) {
      whereClause.email = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    const total = await prisma.user.count({
      where: whereClause,
    });
    const tiers = await prisma.membershipTier.findMany({
      where: whereClause,
      skip: (Number(page) - 1) * limit,
      take: limit,
      orderBy: {
        id: 'desc',
      },
      select: {
        id: true,
        tierName: true,
      },
    });

    const hasMore = tiers.length > limit;
    const actualTiers = hasMore ? tiers.slice(0, limit) : tiers;
    const totalPages = Math.ceil(total / limit);
    return {
      tiers: actualTiers as any,
      hasMore: Number(page) < totalPages,
    };
  }
}

export const membershipSettingUseCase = new MembershipSettingUseCase(
  membershipTierRepository,
  userRepository,
);
