import { Tier } from '@/components/common/charts/scatter-rank-chart/types';
import { ProcessMembershipMode } from '../../data/api';
import { Membership } from '../../domain/entities';
import { DynamicFieldTier } from '../../presentation/schema';

export enum DeleteMode {
  DELETE = ProcessMembershipMode.DELETE,
  DELETE_ALL = ProcessMembershipMode.DELETE_ALL,
}

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
  deleteBenefitTier: {
    idTierToDelete: string | null;
    slugTierToDelete: string | null;
    isShowDialogDeleteBenefitTier: boolean;
  };
  editBenefitTier: {
    idTierToEdit: string | null;
    isShowDialogEditBenefitTier: boolean;
    benefitTierToEdit: DynamicFieldTier | null;
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
  deleteBenefitTier: {
    idTierToDelete: null,
    isShowDialogDeleteBenefitTier: false,
    slugTierToDelete: null,
  },
  editBenefitTier: {
    idTierToEdit: null,
    isShowDialogEditBenefitTier: false,
    benefitTierToEdit: null,
  },
};
