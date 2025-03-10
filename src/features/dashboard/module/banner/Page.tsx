'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionType } from '@prisma/client';
import { Download, Upload } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Section } from './schema';
import SectionManager from './SectionManager';

export default function MediaDashboard() {
  // Separate state for each section type
  const [bannerSection, setBannerSection] = useState<Section>();
  const [visionSection, setVisionSection] = useState<Section>();
  const [kpsSection, setKpsSection] = useState<Section>();
  const [partnerSection, setPartnerSection] = useState<Section>();

  // Handler for saving each section type
  const handleSaveBanner = (section: Section) => {
    setBannerSection(section);
    toast.success('Banner section saved', {
      description: 'Your banner section has been updated successfully.',
    });
  };

  const handleSaveVision = (section: Section) => {
    setVisionSection(section);
    toast.success('Vision & Mission section saved', {
      description: 'Your vision & mission section has been updated successfully.',
    });
  };

  const handleSaveKps = (section: Section) => {
    setKpsSection(section);
    toast.success('KPS section saved', {
      description: 'Your KPS section has been updated successfully.',
    });
  };

  const handleSavePartner = (section: Section) => {
    setPartnerSection(section);
    toast.success('Partner Logo section saved', {
      description: 'Your partner logo section has been updated successfully.',
    });
  };

  // Export all sections as a single configuration
  const exportData = () => {
    const allSections = {
      banner: bannerSection,
      vision: visionSection,
      kps: kpsSection,
      partner: partnerSection,
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

          // Update each section state if it exists in the imported data
          if (importedData.banner) setBannerSection(importedData.banner);
          if (importedData.vision) setVisionSection(importedData.vision);
          if (importedData.kps) setKpsSection(importedData.kps);
          if (importedData.partner) setPartnerSection(importedData.partner);

          toast.success('Import successful', {
            description: 'Your sections have been imported successfully.',
          });
        } catch (error) {
          toast.error('Import failed', {
            description: 'There was an error importing your data. Please check the file format.',
          });
        }
      };
      reader.readAsText(file);
    };

    input.click();
  };

  return (
    <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <CardTitle className="text-2xl">Section & Media Manager</CardTitle>
              <CardDescription>Manage your sections and media in one place</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={importData}>
                <Upload className="h-4 w-4 mr-2" />
                Import All
              </Button>
              <Button variant="outline" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="banner" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          <TabsTrigger value="banner">Banner</TabsTrigger>
          <TabsTrigger value="vision">Vision & Mission</TabsTrigger>
          <TabsTrigger value="kps">KPS</TabsTrigger>
          <TabsTrigger value="partners">Partner Logos</TabsTrigger>
        </TabsList>

        <TabsContent value="banner">
          <SectionManager
            section={bannerSection}
            onSave={handleSaveBanner}
            sectionType={SectionType.BANNER}
          />
        </TabsContent>

        <TabsContent value="vision">
          <SectionManager
            section={visionSection}
            onSave={handleSaveVision}
            sectionType={SectionType.VISION_MISSION}
          />
        </TabsContent>

        <TabsContent value="kps">
          <SectionManager
            section={kpsSection}
            onSave={handleSaveKps}
            sectionType={SectionType.KPS}
          />
        </TabsContent>

        <TabsContent value="partners">
          <SectionManager
            section={partnerSection}
            onSave={handleSavePartner}
            sectionType={SectionType.PARTNER_LOGO}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
