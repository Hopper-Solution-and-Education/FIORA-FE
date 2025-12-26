import { HttpResponse } from '@/shared/types';

export type CompleteAcknowledgmentResponseDto = {
  featureKey: string;
};

export type CompleteAcknowledgmentResponse = HttpResponse<CompleteAcknowledgmentResponseDto>;
