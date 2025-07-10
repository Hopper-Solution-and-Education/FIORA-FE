import { EditMemberShipFormValues } from '../../presentation/schema/editMemberShip.schema';

export class Membership {
  id: string;
  tierName: string;
  mainIconUrl: string;
  passedIconUrl: string;
  inactiveIconUrl: string;
  themeIconUrl: string;
  spentMinThreshold: number;
  spentMaxThreshold: number;
  balanceMinThreshold: number;
  balanceMaxThreshold: number;
  story: string;
  tierBenefits: TierBenefit[];
  createdAt: string;
  updatedAt: string;

  constructor(data: Membership) {
    this.id = data.id;
    this.tierName = data.tierName;
    this.mainIconUrl = data.mainIconUrl;
    this.passedIconUrl = data.passedIconUrl;
    this.inactiveIconUrl = data.inactiveIconUrl;
    this.themeIconUrl = data.themeIconUrl;
    this.spentMinThreshold = data.spentMinThreshold;
    this.spentMaxThreshold = data.spentMaxThreshold;
    this.balanceMinThreshold = data.balanceMinThreshold;
    this.balanceMaxThreshold = data.balanceMaxThreshold;
    this.story = data.story;
    this.tierBenefits = data.tierBenefits;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export class TierBenefit {
  id: string;
  slug: string;
  name: string;
  suffix: string;
  description: string;
  value: number;

  constructor(data: TierBenefit) {
    this.id = data.id;
    this.slug = data.slug;
    this.name = data.name;
    this.suffix = data.suffix;
    this.description = data.description;
    this.value = data.value;
  }
}

export type GetListMembershipsRequest = {
  page: number;
  limit: number;
};

export type GetListMembershipsResponse = {
  data: Membership[];
  message: string;
};

export type UpsertMembershipRequest = EditMemberShipFormValues;

export type UpsertMembershipResponse = {
  data: Membership;
  message: string;
};

export type AddBenefitTierRequest = {
  tierBenefit: AddTierBenefitPayload;
  membershipBenefit: AddMembershipBenefitPayload;
};

export interface AddMembershipBenefitPayload {
  name: string;
  slug: string;
  description?: string;
  suffix?: string;
  userId: string;
}

export interface AddTierBenefitPayload {
  tierId: string;
  value: number;
}

export type AddBenefitTierResponse = {
  data: NewBenefitTier;
  message: string;
};

export type NewBenefitTier = {
  name: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  userId: string;
  slug: string;
  description?: string;
  suffix?: string;
};

export type DeleteBenefitTierRequest = {
  id: string;
};

export type DeleteBenefitTierResponse = {
  data: boolean;
  message: string;
};

export default Membership;
