'use client';

import Loading from '@/components/common/atoms/Loading';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppSelector } from '@/store';
import { SectionType } from '@prisma/client';
import { Download, Upload } from 'lucide-react';
import useBannerSettingLogic from '../hooks/useBannerSettingLogic';
import SectionManager from './components/SectionManager';
import { useEffect } from 'react';
import { landingDIContainer } from '@/features/landing/di/landingDIContainer';

export default function MediaDashboard() {
  const { exportData, importData } = useBannerSettingLogic();
  const isLoadingSaveChange = useAppSelector((state) => state.landingSettings.isLoadingSaveChange);

  useEffect(() => {
    return () => {
      landingDIContainer.unbindAll();
    };
  });

  const sections = [
    { value: 'banner', label: 'Banner', type: SectionType.BANNER },
    { value: 'vision', label: 'Vision & Mission', type: SectionType.VISION_MISSION },
    { value: 'kps', label: 'KPS', type: SectionType.KPS },
    { value: 'partners', label: 'Partner Logos', type: SectionType.PARTNER_LOGO },
    { value: 'header', label: 'Header', type: SectionType.HEADER },
    { value: 'footer', label: 'Footer', type: SectionType.FOOTER },
  ];

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
      {isLoadingSaveChange && <Loading />}
      <Card className="mb-6">
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
      </Card>

      <Tabs defaultValue="banner" className="w-full">
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

        {sections.map((section) => (
          <TabsContent key={section.value} value={section.value} className="p-4">
            <SectionManager sectionType={section.type} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
