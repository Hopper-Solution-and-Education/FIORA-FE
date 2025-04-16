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
      {/* <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle className="text-2xl">Section & Media Manager</CardTitle>
              <CardDescription>Manage your sections and media in one place</CardDescription>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button variant="outline" onClick={importData} className="w-full sm:w-auto">
                <Upload className="h-4 w-4 mr-2" />
                Import All
              </Button>
              <Button variant="outline" onClick={exportData} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card> */}

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
