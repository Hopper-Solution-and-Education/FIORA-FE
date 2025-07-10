import { Membership } from '../../domain/entities';

interface MembershipState {
  isLoadingGetMemberships: boolean;
  memberships: Membership[];
  selectedMembership: Membership | null;
  isLoadingUpsertMembership: boolean;
  isShowDialogAddBenefitTier: boolean;
  isLoadingAddBenefitTier: boolean;
  isLoadingDeleteBenefitTier: boolean;
}

export const initialMembershipState: MembershipState = {
  isLoadingGetMemberships: false,
  memberships: [],
  selectedMembership: null,
  isLoadingUpsertMembership: false,
  isShowDialogAddBenefitTier: false,
  isLoadingAddBenefitTier: false,
  isLoadingDeleteBenefitTier: false,
};
