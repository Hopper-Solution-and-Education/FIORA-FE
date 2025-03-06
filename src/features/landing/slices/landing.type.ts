import { Media } from '../domain/models/Media';

interface LandingStateType {
  media: Media[];
  loading: boolean;
  error: string | null;
}

const initialLandingState: LandingStateType = {
  media: [],
  loading: false,
  error: null,
};

export { initialLandingState };
export type { LandingStateType };
