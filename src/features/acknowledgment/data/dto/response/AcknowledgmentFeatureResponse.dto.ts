import { AcknowledgmentFeature } from '@/features/acknowledgment/domain/entities';
import { HttpResponse } from '@/shared/types';

export type AcknowledgmentFeatureResponse = HttpResponse<AcknowledgmentFeature>;
