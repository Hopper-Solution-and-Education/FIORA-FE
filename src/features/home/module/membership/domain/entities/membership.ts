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
  slug: string;
  name: string;
  suffix: string;
  description: string;
  value: number;

  constructor(data: TierBenefit) {
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

export default Membership;
