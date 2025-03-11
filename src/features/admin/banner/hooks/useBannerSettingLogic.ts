import { useAppDispatch, useAppSelector } from '@/store';
import { SectionType } from '@prisma/client';
import { toast } from 'sonner';
import { Section } from '../schema/media.schema';
import { importSections, saveSection } from '../slices';

const useBannerSettingLogic = () => {
  const dispatch = useAppDispatch();
  const { bannerSection, visionSection, kpsSection, partnerSection } = useAppSelector(
    (state) => state.landingSettings,
  );
  // Handler for saving each section type
  const handleSaveBanner = (section: Section) => {
    dispatch(saveSection({ section, sectionType: SectionType.BANNER }));
  };

  const handleSaveVision = (section: Section) => {
    dispatch(saveSection({ section, sectionType: SectionType.VISION_MISSION }));
  };

  const handleSaveKps = (section: Section) => {
    dispatch(saveSection({ section, sectionType: SectionType.KPS }));
  };

  const handleSavePartner = (section: Section) => {
    dispatch(saveSection({ section, sectionType: SectionType.PARTNER_LOGO }));
  };

  // Export all sections as a single configuration
  const exportData = () => {
    const allSections = {
      bannerSection,
      visionSection,
      kpsSection,
      partnerSection,
    };

    const dataStr = JSON.stringify(allSections, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'sections-config.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Import all sections from a configuration file
  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          dispatch(importSections(importedData));
        } catch {
          toast.error('Import failed', {
            description: 'There was an error importing your data. Please check the file format.',
          });
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  return {
    handleSaveBanner,
    handleSaveVision,
    handleSaveKps,
    handleSavePartner,
    importData,
    exportData,
  };
};

export default useBannerSettingLogic;
