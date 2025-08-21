import { HttpResponse } from '@/shared/types';
import { ProcessMembershipMode } from '../api';

export type DeleteBenefitTierRequestDTO = {
  slug: string;
  tierId: string;
  mode: ProcessMembershipMode;
};

export type DeleteBenefitTierResponseDTO = HttpResponse<boolean>;
