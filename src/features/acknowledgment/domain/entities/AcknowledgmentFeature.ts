export type AcknowledgmentFeature = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy: string | null;
  featureKey: string;
  description: string | null;
  isActive?: boolean;
};
