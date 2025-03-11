// features/sections/sectionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SectionType } from '@prisma/client';
import { toast } from 'sonner';
import { Section } from '../schema/media.schema';

interface SectionsState {
  bannerSection?: Section;
  visionSection?: Section;
  kpsSection?: Section;
  partnerSection?: Section;
}

const initialState: SectionsState = {
  bannerSection: undefined,
  visionSection: undefined,
  kpsSection: undefined,
  partnerSection: undefined,
};

const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
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
    importSections: (state, action: PayloadAction<SectionsState>) => {
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
});

export const { saveSection, importSections } = sectionsSlice.actions;
export default sectionsSlice.reducer;
