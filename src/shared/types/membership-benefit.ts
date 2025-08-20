export type Mode = 'create-all' | 'create' | 'update' | 'update-all' | 'delete' | 'delete-all';

export interface MembershipBenefitCreatePayload {
  tierBenefit: TierBenefit;
  membershipBenefit: MembershipBenefit;
  mode: Mode;
  slug?: string;
  tierId?: string;
}

export interface MembershipBenefit {
  name: string;
  slug: string;
  description?: string;
  suffix?: string;
  userId: string;
}

export interface TierBenefit {
  tierId?: string;
  value: number;
  benefitId?: string;
}

export interface MembershipBenefitUpdatePayload extends MembershipBenefitCreatePayload {
  id: string;
}

export interface MembershipBenefitCreateUpdateAllPayload {
  membershipBenefit: MembershipBenefit;
  tierBenefit: Pick<TierBenefit, 'value'>;
}

export interface MembershipBenefitDeletePayload {
  slug: string;
  tierId: string;
}
