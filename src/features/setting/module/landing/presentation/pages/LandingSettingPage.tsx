'use client';

import Loading from '@/components/common/atoms/Loading';
import { SelectField } from '@/components/common/forms';
import { Option } from '@/components/common/forms/select/SelectField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { useAppSelector } from '@/store';
import { SectionType } from '@prisma/client';
import { useMemo, useState } from 'react';
import SectionManager from '../organisms/SectionManager';

const sections = [
  { value: 'header', label: 'Header', type: SectionType.HEADER },
  { value: 'banner', label: 'Banner', type: SectionType.BANNER },
  { value: 'vision', label: 'Vision & Mission', type: SectionType.VISION_MISSION },
  { value: 'system', label: 'System', type: SectionType.SYSTEM },
  { value: 'kps', label: 'KSP', type: SectionType.KPS },
  { value: 'partners', label: 'Partners', type: SectionType.PARTNER_LOGO },
  { value: 'review', label: 'Review', type: SectionType.REVIEW },
  { value: 'footer', label: 'Footer', type: SectionType.FOOTER },
];

export default function MediaDashboard() {
  // const { exportData, importData } = useBannerSettingLogic();
  const isLoadingSaveChange = useAppSelector((state) => state.landingSettings.isLoadingSaveChange);
  const isLoading = useAppSelector((state) => state.landingSettings.isLoading);
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('header');

  const options = useMemo((): Option[] => {
    return sections.map((section) => ({
      label: section.label,
      value: section.value,
    }));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {(isLoadingSaveChange || isLoading) && <Loading />}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <SelectField
              value={activeTab}
              onChange={(value) => setActiveTab(value)}
              options={options}
              noneValue={false}
            />
          </div>
        ) : (
          // Nếu không phải mobile, hiển thị dạng TabsList
          <TabsList className="flex flex-wrap gap-2 mb-10">
            {sections.map((section) => (
              <TabsTrigger
                key={section.value}
                value={section.value}
                className="flex-1 min-w-[100px] text-center rounded-md bg-transparent hover:bg-gray-100 active:text-white transition-colors duration-200"
              >
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {sections.map((section) => (
          <TabsContent key={section.value} value={section.value}>
            <SectionManager sectionType={section.type} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
