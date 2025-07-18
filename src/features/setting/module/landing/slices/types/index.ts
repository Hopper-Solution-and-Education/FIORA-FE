import { SectionTypeEnum } from '@/features/landing/constants';

export interface IMedia {
  id: string;
  media_url: string;
  media_type: string;
  redirect_url: string;
  embed_code: string;
  description: string;
  uploaded_by: string;
  uploaded_date: Date;
  section_id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ISection {
  id: string;
  name: string;
  order: number;
  section_type: SectionTypeEnum;
  createdAt: Date;
  updatedAt: Date;
  medias: IMedia[];
  createdBy: string;
  updatedBy: string;
}

interface LandingSettingsState {
  bannerSection?: ISection;
  visionSection?: ISection;
  kpsSection?: ISection;
  partnerSection?: ISection;
  footerSection?: ISection;
  headerSection?: ISection;
  reviewSection?: ISection;
  fioraSystemSection?: ISection;
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
  headerSection: undefined,
  footerSection: undefined,
  fioraSystemSection: undefined,
  reviewSection: undefined,
  error: '',
  fetchedSections: [],
  isLoading: false,
  isLoadingSaveChange: false,
};

export { initialLandingSettingState };
export type { LandingSettingsState };
