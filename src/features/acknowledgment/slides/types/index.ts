import { AcknowledgmentFeatureSteps } from '../../domain/entities';

interface IAcknowledgmentState {
  isLoading: boolean;
  isLoaded: boolean;
  data: AcknowledgmentFeatureSteps;
}

export const initialAcknowledgmentState: IAcknowledgmentState = {
  isLoading: false,
  isLoaded: false,
  data: {},
};
