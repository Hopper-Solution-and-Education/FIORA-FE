import { HttpResponse } from '@/shared/types';

export type AcknowledgmentFeatureSteps = {
  id: string;
  featureKey: string;
  description: string | null;
  steps?: AcknowledgmentStep[];
};

export type AcknowledgmentStep = {
  id: string;
  featureId?: string;
  stepOrder: number;
  title: string;
  description: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string | null;
  updatedBy?: string | null;
};

export type AcknowledgmentFeatureStepsResponse = HttpResponse<AcknowledgmentFeatureSteps[]>;

export type AcknowledgmentSingleFeatureStepsResponse = HttpResponse<AcknowledgmentFeatureSteps>;
