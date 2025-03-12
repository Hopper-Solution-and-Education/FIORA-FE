import { Media, Section } from '@prisma/client';

export interface ISection extends Section {
  medias: Media[];
}

interface LandingSettingsState {
  bannerSection?: ISection;
  visionSection?: ISection;
  kpsSection?: ISection;
  partnerSection?: ISection;
  fetchedSections: string[];
  error: string | null;
  isLoading: boolean;
}

const initialLandingSettingState: LandingSettingsState = {
  bannerSection: undefined,
  visionSection: undefined,
  kpsSection: undefined,
  partnerSection: undefined,
  error: '',
  fetchedSections: [],
  isLoading: false,
};

export { initialLandingSettingState };
export type { LandingSettingsState };
