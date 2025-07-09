export interface MembershipBenefitCreatePayload {
  tierBenefit: TierBenefit;
  membershipBenefit: MembershipBenefit;
}

export interface MembershipBenefit {
  name: string;
  slug: string;
  description?: string;
  suffix?: string;
  userId: string;
}

export interface TierBenefit {
  tierId: string;
  benefitId: string;
  value: number;
}

export interface MembershipBenefitUpdatePayload extends MembershipBenefitCreatePayload {
  id: string;
}
