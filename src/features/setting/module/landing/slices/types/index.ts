import { SectionTypeEnum } from '@/features/landing/constants';
import { IAnnouncement } from '../../domain/entities/Announcement';

export interface IMedia {
  id: string;
  media_url: string | null;
  media_url_2: string | null;
  media_order: number;
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
  mediaReviewUser: {
    media_user_name: string;
    media_user_title: string;
    media_user_avatar: string;
    media_user_comment: string;
    media_user_rating: number;
    media_user_email: string;
    createdBy: string;
    updatedBy: string;
  } | null;
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
  announcements: IAnnouncement[];
  isLoadingAnnouncement: boolean;
  isLoadingUpdateAnnouncement: boolean;
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
  announcements: [],
  isLoadingAnnouncement: false,
  isLoadingUpdateAnnouncement: false,
};

export { initialLandingSettingState };
export type { LandingSettingsState };
