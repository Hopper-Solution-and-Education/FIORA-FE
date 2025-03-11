import { Section, SectionType } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { fetchMediaBySection } from './actions/fetchMediaBySection';
import { initialLandingSettingState, LandingSettingsState } from './types';

const landingSettings = createSlice({
  name: 'landingSettings',
  initialState: initialLandingSettingState,
  reducers: {
    saveSection: (state, action: PayloadAction<{ section: Section; sectionType: SectionType }>) => {
      const { section, sectionType } = action.payload;

      switch (sectionType) {
        case SectionType.BANNER:
          state.bannerSection = section;
          toast.success('Banner section saved', {
            description: 'Your banner section has been updated successfully.',
          });
          break;
        case SectionType.VISION_MISSION:
          state.visionSection = section;
          toast.success('Vision & Mission section saved', {
            description: 'Your vision & mission section has been updated successfully.',
          });
          break;
        case SectionType.KPS:
          state.kpsSection = section;
          toast.success('KPS section saved', {
            description: 'Your KPS section has been updated successfully.',
          });
          break;
        case SectionType.PARTNER_LOGO:
          state.partnerSection = section;
          toast.success('Partner Logo section saved', {
            description: 'Your partner logo section has been updated successfully.',
          });
          break;
        default:
          break;
      }
    },
    importSections: (state, action: PayloadAction<LandingSettingsState>) => {
      const importedData = action.payload;
      state.bannerSection = importedData.bannerSection || state.bannerSection;
      state.visionSection = importedData.visionSection || state.visionSection;
      state.kpsSection = importedData.kpsSection || state.kpsSection;
      state.partnerSection = importedData.partnerSection || state.partnerSection;
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

    builder.addCase(
      fetchMediaBySection.fulfilled,
      (state, action: PayloadAction<Section, string, { arg: SectionType }>) => {
        switch (action.payload.section_type) {
          case SectionType.BANNER:
            state.bannerSection = action.payload;
            break;
          case SectionType.VISION_MISSION:
            state.visionSection = action.payload;
            break;
          case SectionType.KPS:
            state.kpsSection = action.payload;
            break;
          case SectionType.PARTNER_LOGO:
            state.partnerSection = action.payload;
            break;
          default:
            break;
        }
      },
    );

    builder.addCase(fetchMediaBySection.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Unknown error occurred';
    });
  },
});

export const { saveSection, importSections } = landingSettings.actions;
export default landingSettings.reducer;
