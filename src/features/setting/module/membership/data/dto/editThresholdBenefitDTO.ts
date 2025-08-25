import { HttpResponse } from '@/shared/types';
import { Membership } from '../../domain/entities';

export type EditThresholdBenefitRequestDTO = {
  axis: string;
  oldMin: number;
  oldMax: number;
  newMin: number;
  newMax: number;
};

export type EditThresholdBenefitResponseDTO = HttpResponse<Membership>;
