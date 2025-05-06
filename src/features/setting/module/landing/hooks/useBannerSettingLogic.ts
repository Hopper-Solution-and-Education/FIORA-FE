import { useAppDispatch, useAppSelector } from '@/store';
import { toast } from 'sonner';
import { importSections } from '../slices';

const useBannerSettingLogic = () => {
  const dispatch = useAppDispatch();
  const { bannerSection, visionSection, kpsSection, partnerSection, headerSection, footerSection } =
    useAppSelector((state) => state.landingSettings);

  // Export all sections as a single configuration
  const exportData = () => {
    const allSections = {
      bannerSection,
      visionSection,
      kpsSection,
      partnerSection,
      headerSection,
      footerSection,
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
    importData,
    exportData,
  };
};

export default useBannerSettingLogic;
