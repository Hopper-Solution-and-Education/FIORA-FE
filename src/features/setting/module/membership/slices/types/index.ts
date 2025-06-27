import { Membership } from '../../domain/entities';

interface MembershipState {
  isLoadingGetMemberships: boolean;
  memberships: Membership[];
  selectedMembership: Membership | null;
  isLoadingUpsertMembership: boolean;
}

export const initialMembershipState: MembershipState = {
  isLoadingGetMemberships: false,
  memberships: [],
  selectedMembership: null,
  isLoadingUpsertMembership: false,
};
