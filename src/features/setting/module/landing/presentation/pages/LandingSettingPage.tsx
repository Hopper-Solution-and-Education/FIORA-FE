'use client';

import Loading from '@/components/common/atoms/Loading';
import { SelectField } from '@/components/common/forms';
import { Option } from '@/components/common/forms/select/SelectField';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionTypeEnum } from '@/features/landing/constants';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { useAppSelector } from '@/store';
import { useMemo, useState } from 'react';
import AnnouncementManager from '../organisms/AnnouncementManager';
import SectionManager from '../organisms/SectionManager';

const sections = [
  { value: 'header', label: 'Header', type: SectionTypeEnum.HEADER },
  { value: 'banner', label: 'Banner', type: SectionTypeEnum.BANNER },
  { value: 'vision', label: 'Vision & Mission', type: SectionTypeEnum.VISION_MISSION },
  { value: 'system', label: 'System', type: SectionTypeEnum.SYSTEM },
  { value: 'ksp', label: 'KSP', type: SectionTypeEnum.KPS },
  { value: 'partners', label: 'Partners', type: SectionTypeEnum.PARTNER_LOGO },
  { value: 'review', label: 'Review', type: SectionTypeEnum.REVIEW },
  { value: 'footer', label: 'Footer', type: SectionTypeEnum.FOOTER },
  { value: 'announcement', label: 'Announcement', type: 'ANNOUNCEMENT' },
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
          <TabsList className="flex flex-wrap gap-2 mb-10">
            {sections.map((section) => (
              <TabsTrigger
                key={section.value}
                value={section.value}
                data-test={section.value}
                className="flex-1 min-w-[100px] text-center rounded-md bg-transparent hover:bg-gray-100 active:text-white transition-colors duration-200"
              >
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>
        )}

        {sections.map((section) => (
          <TabsContent key={section.value} value={section.value}>
            {section.type === 'ANNOUNCEMENT' ? (
              <AnnouncementManager />
            ) : (
              <SectionManager sectionType={section.type as SectionTypeEnum} />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
