'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionType } from '@prisma/client';
import { Download, Upload } from 'lucide-react';
import useBannerSettingLogic from '../hooks/useBannerSettingLogic';
import SectionManager from './components/SectionManager';

export default function MediaDashboard() {
  const { exportData, importData } = useBannerSettingLogic();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
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
        <TabsList className="flex flex-wrap justify-start gap-2 mb-6 overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible">
          <TabsTrigger value="banner" className="flex-1 min-w-[100px] text-center">
            Banner
          </TabsTrigger>
          <TabsTrigger value="vision" className="flex-1 min-w-[100px] text-center">
            Vision & Mission
          </TabsTrigger>
          <TabsTrigger value="kps" className="flex-1 min-w-[100px] text-center">
            KPS
          </TabsTrigger>
          <TabsTrigger value="partners" className="flex-1 min-w-[100px] text-center">
            Partner Logos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="banner">
          <SectionManager sectionType={SectionType.BANNER} />
        </TabsContent>

        <TabsContent value="vision">
          <SectionManager sectionType={SectionType.VISION_MISSION} />
        </TabsContent>

        <TabsContent value="kps">
          <SectionManager sectionType={SectionType.KPS} />
        </TabsContent>

        <TabsContent value="partners">
          <SectionManager sectionType={SectionType.PARTNER_LOGO} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
