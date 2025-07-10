import { HttpResponse } from '@/shared/types';
import {
  AddMembershipBenefitPayload,
  AddTierBenefitPayload,
  NewBenefitTier,
} from '../../domain/entities';

export interface AddBenefitTierRequestDTO {
  tierBenefit: AddTierBenefitPayload;
  membershipBenefit: AddMembershipBenefitPayload;
}

export type AddBenefitTierResponseDTO = HttpResponse<NewBenefitTier>;
