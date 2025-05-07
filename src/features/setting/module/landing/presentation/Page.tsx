'use client';

import Loading from '@/components/common/atoms/Loading';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { useAppSelector } from '@/store';
import { SectionType } from '@prisma/client';
import { useState } from 'react';
import SectionManager from './components/SectionManager';

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
  // State để lưu giá trị tab hiện tại
  const [activeTab, setActiveTab] = useState('header');

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      {(isLoadingSaveChange || isLoading) && <Loading />}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {isMobile ? (
          <div className="mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                {sections.find((section) => section.value === activeTab)?.label || 'Select Section'}
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.value} value={section.value}>
                    {section.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
