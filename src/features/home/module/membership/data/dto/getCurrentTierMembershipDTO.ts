import { HttpResponse } from '@/shared/types';
import { GetCurrentTierResponse } from '../../domain/entities';

export type getCurrentTierResponseDTO = HttpResponse<GetCurrentTierResponse>;
