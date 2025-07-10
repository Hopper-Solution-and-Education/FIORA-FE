import { HttpResponse } from '@/shared/types';

export type DeleteBenefitTierRequestDTO = {
  id: string;
};

export type DeleteBenefitTierResponseDTO = HttpResponse<boolean>;
