import { Membership } from '../../domain/entities';

interface MembershipState {
  isLoadingGetMemberships: boolean;
  memberships: Membership[];
}

export const initialMembershipState: MembershipState = {
  isLoadingGetMemberships: false,
  memberships: [],
};
