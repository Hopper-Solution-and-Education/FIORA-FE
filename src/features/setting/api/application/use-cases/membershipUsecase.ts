import { prisma } from '@/config';
import { Messages } from '@/shared/constants/message';
import { InfinityParams, InfinityResult } from '@/shared/dtos/base-api-response.dto';
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
  OutputTierInfinity,
  Range,
  RangeKeys,
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
    const defaultMembership = await prisma.membershipTier.findFirst({
      where: {
        balanceMinThreshold: {
          equals: 0,
        },
        spentMinThreshold: {
          equals: 0,
        },
      },
      select: {
        id: true,
      },
    });

    if (defaultMembership) {
      return prisma.membershipProgress.create({
        data: {
          userId,
          currentSpent: new Prisma.Decimal(0),
          currentBalance: new Prisma.Decimal(0),
          createdBy: userId,
          tierId: defaultMembership.id,
        },
      });
    }

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
    const CEILING = 99999999998;

    const { axis, oldMin, oldMax, newMin, newMax } = data;
    const { minKey, maxKey } = axisKeys(axis);

    const dOldMin = new Prisma.Decimal(oldMin);
    const dOldMax = new Prisma.Decimal(oldMax);
    const dNewMin = new Prisma.Decimal(newMin);
    const dNewMax = new Prisma.Decimal(newMax);

    const dFloor = new Prisma.Decimal(FLOOR);
    const dCeil = new Prisma.Decimal(CEILING);

    // --- BASIC VALIDATION ---

    if (dOldMin.lt(dFloor) || dOldMax.gt(dCeil)) {
      throw new BadRequestError(
        'Old min must be >= 0 and old max must be <= 99999999998',
      );
    }

    // new range must be within [FLOOR, CEILING]
    if (dNewMin.lt(dFloor) || dNewMax.gt(dCeil)) {
      throw new BadRequestError(
        'New min/max must be within [0, 99999999998]',
      );
    }

    // Không cho newMin < oldMin (shrink left only / giữ invariant bạn đang dùng)
    if (dNewMin.lt(dOldMin)) {
      throw new BadRequestError('New min must be greater than or equal to old min');
    }

    // newMax phải >= newMin
    if (dNewMax.lt(dNewMin)) {
      throw new BadRequestError('New max must be greater than or equal to new min');
    }

    // Đảm bảo tier hiện tại tồn tại
    const targetCount = await prisma.membershipTier.count({
      where: { [minKey]: dOldMin, [maxKey]: dOldMax } as any,
    });

    if (targetCount === 0) {
      throw new BadRequestError('Membership tier not found (old range)');
    }

    // --- OVERLAP VALIDATION (KHÔNG ĐƯỢC ẢNH HƯỞNG QUÁ 2 NEIGHBORS) ---

    const overlapTiers = await prisma.membershipTier.findMany({
      where: {
        ...overlapWhere(axis, newMin, newMax),
      },
      select: { [minKey]: true, [maxKey]: true },
      distinct: [minKey, maxKey],
      orderBy: { [minKey]: 'asc' } as any,
    });

    const isSameRange = (t: any) =>
      new Prisma.Decimal(t[minKey]).eq(dOldMin) &&
      new Prisma.Decimal(t[maxKey]).eq(dOldMax);

    const otherOverlaps = overlapTiers.filter((t) => !isSameRange(t));

    // current + tối đa 2 neighbors (prev + next) => tổng length tối đa = 3
    if (overlapTiers.length > 3 || otherOverlaps.length > 2) {
      throw new BadRequestError(
        'Change would affect more than one neighboring tier; rejected.',
      );
    }

    // --- FIND IMMEDIATE NEIGHBORS BASED ON CURRENT EDGES ---

    const nextMinOld = oldMax + 1;
    const prevMaxOld = oldMin - 1;

    const [nextNeighbor, prevNeighbor] = await Promise.all([
      prisma.membershipTier.findFirst({
        where: { [minKey]: new Prisma.Decimal(nextMinOld) } as any,
        select: { [minKey]: true, [maxKey]: true },
        orderBy: { [maxKey]: 'desc' } as any,
      }),
      prevMaxOld >= FLOOR
        ? prisma.membershipTier.findFirst({
          where: { [maxKey]: new Prisma.Decimal(prevMaxOld) } as any,
          select: { [minKey]: true, [maxKey]: true },
          orderBy: { [minKey]: 'asc' } as any,
        })
        : Promise.resolve(null),
    ]);

    // Lưu range neighbor để dùng lại trong transaction
    let nextRange: { min: number; max: number } | null = null;
    let prevRange: { min: number; max: number } | null = null;

    // --- VALIDATE SNAP NEXT: next.min = newMax + 1 ---

    if (nextNeighbor) {
      const next = rng((nextNeighbor as any)[minKey], (nextNeighbor as any)[maxKey]);
      nextRange = next;

      const snappedNextMin = dNewMax.add(1);

      if (snappedNextMin.gt(new Prisma.Decimal(next.max))) {
        throw new ConflictError('Next tier would become invalid after snap (min > max).');
      }

      // second next: tier có min lớn hơn min của next
      const secondNext = await prisma.membershipTier.findFirst({
        where: {
          [minKey]: { gt: new Prisma.Decimal(next.min) },
        } as any,
        select: { [minKey]: true },
        orderBy: { [minKey]: 'asc' } as any,
      });

      if (secondNext) {
        const secondNextMin = new Prisma.Decimal((secondNext as any)[minKey]);
        if (snappedNextMin.gte(secondNextMin)) {
          throw new ConflictError(
            'Change would ripple beyond the immediate next tier; rejected.',
          );
        }
      }
    }

    // --- VALIDATE SNAP PREV: prev.max = newMin - 1 ---

    if (prevNeighbor) {
      const prev = rng((prevNeighbor as any)[minKey], (prevNeighbor as any)[maxKey]);
      prevRange = prev;

      const snappedPrevMax = dNewMin.sub(1);

      if (snappedPrevMax.lt(new Prisma.Decimal(prev.min))) {
        throw new ConflictError('Previous tier would become invalid after snap (max < min).');
      }

      const secondPrev = await prisma.membershipTier.findFirst({
        where: {
          [maxKey]: { lt: new Prisma.Decimal(prev.max) },
        } as any,
        select: { [maxKey]: true },
        orderBy: { [maxKey]: 'desc' } as any,
      });

      if (secondPrev) {
        const secondPrevMax = new Prisma.Decimal((secondPrev as any)[maxKey]);
        if (snappedPrevMax.lte(secondPrevMax)) {
          throw new ConflictError(
            'Change would ripple beyond the immediate previous tier; rejected.',
          );
        }
      }
    }

    // --- TRANSACTION: UPDATE CURRENT + SNAP NEIGHBORS ---

    return await prisma.$transaction(async (tx) => {
      // 1) Update current tier(s) on this axis
      const updatedCurrentTier = await tx.membershipTier.updateMany({
        where: { [minKey]: dOldMin, [maxKey]: dOldMax } as any,
        data: { [minKey]: dNewMin, [maxKey]: dNewMax, updatedBy: userId },
      });

      if (!updatedCurrentTier.count) {
        throw new ConflictError('Membership tier not found during update (race condition).');
      }

      // 2) Snap next neighbor: all tiers có minKey = next.min (trên cùng axis)
      let snapNextCount = 0;
      if (nextRange) {
        const snappedNextMin = dNewMax.add(1);
        const resNext = await tx.membershipTier.updateMany({
          where: {
            [minKey]: new Prisma.Decimal(nextRange.min),
          } as any,
          data: {
            [minKey]: snappedNextMin,
            updatedBy: userId,
          },
        });
        snapNextCount = resNext.count;
      }

      // 3) Snap previous neighbor: all tiers có maxKey = prev.max (trên cùng axis)
      let snapPrevCount = 0;
      if (prevRange) {
        const snappedPrevMax = dNewMin.sub(1);
        const resPrev = await tx.membershipTier.updateMany({
          where: {
            [maxKey]: new Prisma.Decimal(prevRange.max),
          } as any,
          data: {
            [maxKey]: snappedPrevMax,
            updatedBy: userId,
          },
        });
        snapPrevCount = resPrev.count;
      }

      return {
        updated: updatedCurrentTier.count,
        snapNext: snapNextCount,
        snapPrev: snapPrevCount,
      };
    });
  }


  async getTierInfinity(params: InfinityParams): Promise<InfinityResult<OutputTierInfinity>> {
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
      items: actualTiers as any,
      hasMore: Number(page) < totalPages,
    };
  }
}

export const membershipSettingUseCase = new MembershipSettingUseCase(
  membershipTierRepository,
  userRepository,
);
