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
  isLoadingSaveChange: boolean;
}

const initialLandingSettingState: LandingSettingsState = {
  bannerSection: undefined,
  visionSection: undefined,
  kpsSection: undefined,
  partnerSection: undefined,
  error: '',
  fetchedSections: [],
  isLoading: false,
  isLoadingSaveChange: false,
};

export { initialLandingSettingState };
export type { LandingSettingsState };
