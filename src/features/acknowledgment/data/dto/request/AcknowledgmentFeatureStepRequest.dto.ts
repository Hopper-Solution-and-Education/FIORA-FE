type StepsDto = {
  stepOrder: number;
  title: string;
  description: string;
};

export type AcknowledgmentFeatureStepRequestDto = {
  featureId: string;
  steps: StepsDto[];
};
