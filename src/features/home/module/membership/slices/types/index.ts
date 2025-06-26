import { Membership } from '../../domain/entities';

interface MembershipState {
  isLoadingGetMemberships: boolean;
  memberships: Membership[];
  selectedMembership: Membership | null;
}

export const initialMembershipState: MembershipState = {
  isLoadingGetMemberships: false,
  memberships: [],
  selectedMembership: null,
};
