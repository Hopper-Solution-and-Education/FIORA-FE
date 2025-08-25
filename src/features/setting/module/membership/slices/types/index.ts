import { Tier } from '@/components/common/charts/scatter-rank-chart/types';
import { Membership } from '../../domain/entities';

interface MembershipState {
  isLoadingGetMemberships: boolean;
  memberships: Membership[];
  selectedMembership: Membership | null;
  isLoadingUpsertMembership: boolean;
  isShowDialogAddBenefitTier: boolean;
  isLoadingAddUpdateBenefitTier: boolean;
  isLoadingDeleteBenefitTier: boolean;
  isLoadingEditThresholdBenefit: boolean;
  isDialogEditThresholdBenefitOpen: boolean;
  tierToEdit: {
    axis: 'balance' | 'spent';
    selectedTier: Tier | null;
    nextTier: Tier | null;
    previousTier: Tier | null;
  };
}

export const initialMembershipState: MembershipState = {
  isLoadingGetMemberships: false,
  memberships: [],
  selectedMembership: null,
  isLoadingUpsertMembership: false,
  isShowDialogAddBenefitTier: false,
  isLoadingAddUpdateBenefitTier: false,
  isLoadingDeleteBenefitTier: false,
  isLoadingEditThresholdBenefit: false,
  isDialogEditThresholdBenefitOpen: false,
  tierToEdit: {
    axis: 'balance',
    selectedTier: null,
    nextTier: null,
    previousTier: null,
  },
};
