import { HttpResponse } from '@/shared/types';
import {
  AddMembershipBenefitPayload,
  AddTierBenefitPayload,
  NewBenefitTier,
} from '../../domain/entities';
import { ProcessMembershipMode } from '../api/membershipApi';

export interface AddUpdateBenefitTierRequestDTO {
  tierBenefit: AddTierBenefitPayload;
  membershipBenefit: AddMembershipBenefitPayload;
  mode: ProcessMembershipMode;
}

export type AddUpdateBenefitTierResponseDTO = HttpResponse<NewBenefitTier>;
