import { HttpResponse } from '@/shared/types';
import { ProcessMembershipMode } from '../api';

export type DeleteBenefitTierRequestDTO = {
  slug: string;
  membershipTierId?: string;
  membershipBenefitId?: string;
  mode: ProcessMembershipMode;
};

export type DeleteBenefitTierResponseDTO = HttpResponse<boolean>;
