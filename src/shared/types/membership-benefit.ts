export interface MembershipBenefitCreatePayload {
  name: string;
  slug: string;
  description?: string;
  suffix?: string;
  userId: string;
}

export interface MembershipBenefitUpdatePayload extends MembershipBenefitCreatePayload {
  id: string;
}
