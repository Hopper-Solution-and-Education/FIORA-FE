import { SectionType } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { fetchMediaBySection } from './actions/fetchMediaBySection';
import { updateMediaBySection } from './actions/updateMediaBySection';
import { initialLandingSettingState, ISection, LandingSettingsState } from './types';

export const sectionMapping: Record<SectionType, keyof LandingSettingsState> = {
  [SectionType.BANNER]: 'bannerSection',
  [SectionType.VISION_MISSION]: 'visionSection',
  [SectionType.KPS]: 'kpsSection',
  [SectionType.PARTNER_LOGO]: 'partnerSection',
  [SectionType.HEADER]: 'headerSection',
  [SectionType.FOOTER]: 'footerSection',
  [SectionType.SYSTEM]: 'fioraSystemSection',
  [SectionType.REVIEW]: 'reviewSection',
};

const landingSettings = createSlice({
  name: 'landingSettings',
  initialState: initialLandingSettingState,
  reducers: {
    saveSection: (
      state,
      action: PayloadAction<{ section: ISection; sectionType: SectionType }>,
    ) => {
      const { section, sectionType } = action.payload;
      const sectionKey = sectionMapping[sectionType];
      if (sectionKey) {
        (state[sectionKey] as ISection) = section;
      }
    },
    changeIsLoadingSaveChange: (state, action) => {
      state.isLoadingSaveChange = action.payload;
    },
    markSectionFetched: (state, action: PayloadAction<string>) => {
      if (!state.fetchedSections.includes(action.payload)) {
        state.fetchedSections.push(action.payload);
      }
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

    builder.addCase(updateMediaBySection.fulfilled, (state, action) => {
      const sectionKey = sectionMapping[action.payload.section_type];
      if (sectionKey) {
        (state[sectionKey] as ISection) = action.payload;
      }
      state.isLoading = false;
    });
  },
});

export const { saveSection, importSections, markSectionFetched, changeIsLoadingSaveChange } =
  landingSettings.actions;
export default landingSettings.reducer;
