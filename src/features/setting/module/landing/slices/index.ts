import { SectionTypeEnum } from '@/features/landing/constants';
import { HttpResponse } from '@/shared/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { IAnnouncement } from '../domain/entities/Announcement';
import { fetchAnnouncement } from './actions/fetchAnnouncement';
import { fetchMediaBySection } from './actions/fetchMediaBySection';
import { updateAnnouncement } from './actions/updateAnnouncement';
import { updateMediaBySection } from './actions/updateMediaBySection';
import { initialLandingSettingState, ISection, LandingSettingsState } from './types';

export const sectionMapping: Record<SectionTypeEnum, keyof LandingSettingsState> = {
  [SectionTypeEnum.BANNER]: 'bannerSection',
  [SectionTypeEnum.VISION_MISSION]: 'visionSection',
  [SectionTypeEnum.KPS]: 'kpsSection',
  [SectionTypeEnum.PARTNER_LOGO]: 'partnerSection',
  [SectionTypeEnum.HEADER]: 'headerSection',
  [SectionTypeEnum.FOOTER]: 'footerSection',
  [SectionTypeEnum.SYSTEM]: 'fioraSystemSection',
  [SectionTypeEnum.REVIEW]: 'reviewSection',
};

const landingSettings = createSlice({
  name: 'landingSettings',
  initialState: initialLandingSettingState,
  reducers: {
    saveSection: (
      state,
      action: PayloadAction<{ section: ISection; sectionType: SectionTypeEnum }>,
    ) => {
      const { section, sectionType } = action.payload;
      const sectionKey = sectionMapping[sectionType];
      if (sectionKey) {
        (state[sectionKey] as ISection) = section;
      }
    },
    markSectionFetched: (state, action: PayloadAction<string>) => {
      if (!state.fetchedSections.includes(action.payload)) {
        state.fetchedSections.push(action.payload);
      }
    },
    changeIsLoadingSaveChange: (state, action: PayloadAction<boolean>) => {
      state.isLoadingSaveChange = action.payload;
    },
    importSections: (state, action: PayloadAction<LandingSettingsState>) => {
      const importedData = action.payload;
      state.bannerSection = importedData.bannerSection || state.bannerSection;
      state.visionSection = importedData.visionSection || state.visionSection;
      state.kpsSection = importedData.kpsSection || state.kpsSection;
      state.partnerSection = importedData.partnerSection || state.partnerSection;
      state.headerSection = importedData.headerSection || state.headerSection;
      state.footerSection = importedData.footerSection || state.footerSection;
      toast.success('Import successful', {
        description: 'Your sections have been imported successfully.',
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMediaBySection.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });

    builder.addCase(fetchMediaBySection.fulfilled, (state, action: PayloadAction<ISection>) => {
      const sectionKey = sectionMapping[action.payload.section_type];
      if (sectionKey) {
        (state[sectionKey] as ISection) = action.payload;
      }
      state.isLoading = false;
    });

    builder.addCase(fetchMediaBySection.rejected, (state, action) => {
      state.isLoading = false;
      state.error = (action.payload as any) ?? 'Unknown error occurred';
    });

    builder.addCase(updateMediaBySection.pending, (state) => {
      state.isLoadingSaveChange = true;
    });

    builder.addCase(updateMediaBySection.fulfilled, (state, action) => {
      const sectionKey = sectionMapping[action.payload.section_type];
      if (sectionKey) {
        (state[sectionKey] as ISection) = action.payload;
      }
      state.isLoadingSaveChange = false;
    });

    builder.addCase(updateMediaBySection.rejected, (state, action) => {
      state.isLoadingSaveChange = false;
      state.error = (action.payload as any) ?? 'Unknown error occurred';
    });

    builder.addCase(fetchAnnouncement.pending, (state) => {
      state.isLoadingAnnouncement = true;
      state.error = null;
    });

    builder.addCase(fetchAnnouncement.fulfilled, (state, action) => {
      state.announcements = action.payload.data;
      state.isLoadingAnnouncement = false;
    });

    builder.addCase(fetchAnnouncement.rejected, (state, action) => {
      state.isLoadingAnnouncement = false;
      state.error = (action.payload as any) ?? 'Unknown error occurred';
    });

    builder.addCase(updateAnnouncement.pending, (state) => {
      state.isLoadingUpdateAnnouncement = true;
      state.error = null;
    });

    builder.addCase(
      updateAnnouncement.fulfilled,
      (state, action: PayloadAction<HttpResponse<IAnnouncement[]>>) => {
        state.announcements = action.payload.data;
        state.isLoadingUpdateAnnouncement = false;
      },
    );

    builder.addCase(updateAnnouncement.rejected, (state, action) => {
      state.isLoadingUpdateAnnouncement = false;
      state.error = (action.payload as any) ?? 'Unknown error occurred';
    });
  },
});

export const { saveSection, importSections, markSectionFetched, changeIsLoadingSaveChange } =
  landingSettings.actions;
export default landingSettings.reducer;
