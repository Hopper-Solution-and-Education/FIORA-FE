import { HttpResponse } from '@/shared/types';
import { NewBenefitTier } from '../../domain/entities';

export interface AddBenefitTierRequestDTO {
  name: string;
  slug: string;
  description?: string;
  suffix?: string;
  userId: string;
}

export type AddBenefitTierResponseDTO = HttpResponse<NewBenefitTier>;
