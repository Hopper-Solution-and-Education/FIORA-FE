import { GetCurrentTierResponse, Membership } from '../../domain/entities';

interface MembershipState {
  isLoadingGetMemberships: boolean;
  memberships: Membership[];
  userTier: {
    data: GetCurrentTierResponse | null;
    isLoading: boolean;
  };
}

export const initialMembershipState: MembershipState = {
  isLoadingGetMemberships: false,
  memberships: [],
  userTier: {
    data: null,
    isLoading: false,
  },
};
