import { MembershipTier, Prisma } from '@prisma/client';

export interface IMembershipTierRepository {
  createMembershipTier(
    data: Prisma.MembershipTierCreateInput,
    prismaTx?: Prisma.TransactionClient,
  ): Promise<MembershipTier>;
  findMembershipTierById(id: string): Promise<MembershipTier | null>;
  updateMembershipTier(id: string, data: Prisma.MembershipTierUpdateInput): Promise<MembershipTier>;
  deleteMembershipTier(id: string): Promise<void>;
  findMembershipTiersDashboard(
    where?: Prisma.MembershipTierWhereInput,
    options?: Prisma.MembershipTierFindManyArgs,
  ): Promise<MembershipTierWithBenefit[]>;

  findFirstMembershipTier(
    where?: Prisma.MembershipTierWhereInput,
    options?: Prisma.MembershipTierFindFirstArgs,
  ): Promise<MembershipTier | null>;
  upsertMembershipTier(
    data: Prisma.MembershipTierCreateInput,
    prismaTx?: Prisma.TransactionClient,
  ): Promise<MembershipTier>;
}

export interface MembershipTierCreation {
  id?: string;
  tierName: string;
  mainIconUrl?: string;
  passedIconUrl?: string;
  inactiveIconUrl?: string;
  themeIconUrl?: string;
  spentMinThreshold: number;
  spentMaxThreshold: number;
  balanceMinThreshold: number;
  balanceMaxThreshold: number;
  story?: string;
  tierBenefits: TierBenefitCreation[];
}

export interface MembershipTierUpdate {
  axis: 'spent' | 'balance';
  // identify the tier by old range (exact)
  oldMin: number; // old minimum threshold
  oldMax: number; // old maximum threshold
  newMin: number; // new minimum threshold
  newMax: number; // new maximum threshold
}

export interface TierBenefitCreation {
  slug: string;
  value: number;
}

export type MembershipTierWithBenefit = Prisma.MembershipTierGetPayload<{
  include: {
    tierBenefits: {
      select: {
        value: true;
        benefit: {
          select: {
            slug: true;
            name: true;
            suffix: true;
            description: true;
          };
        };
      };
    };
  };
  omit: {
    userId: true;
    createdAt: true;
    updatedAt: true;
    createdBy: true;
    updatedBy: true;
  };
  orderBy: [{ balanceMinThreshold: 'asc' }, { spentMinThreshold: 'asc' }];
}>;

export type Axis = 'spent' | 'balance';
export type RangeKeys =
  | { minKey: 'spentMinThreshold'; maxKey: 'spentMaxThreshold' }
  | { minKey: 'balanceMinThreshold'; maxKey: 'balanceMaxThreshold' };
export type Range = { min: number; max: number };
