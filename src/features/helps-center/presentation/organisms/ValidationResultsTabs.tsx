import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaqsImportValidationResult } from '../../domain/entities/models/faqs';
import { CheckCircle, FileText, XCircle } from 'lucide-react';
import React from 'react';
import ValidationResults from '../molecules/ValidationResults';

interface ValidationResultsTabsProps {
  validationResult: FaqsImportValidationResult;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ValidationResultsTabs: React.FC<ValidationResultsTabsProps> = ({
  validationResult,
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs defaultValue="all" className="mb-6" onValueChange={onTabChange} value={activeTab}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="all" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          All ({validationResult.totalRows})
        </TabsTrigger>
        <TabsTrigger value="valid" className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Valid ({validationResult.validRows})
        </TabsTrigger>
        <TabsTrigger value="invalid" className="flex items-center gap-2">
          <XCircle className="h-4 w-4" />
          Invalid ({validationResult.invalidRows})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <ValidationResults records={validationResult?.rows || []} filter="all" />
      </TabsContent>

      <TabsContent value="valid">
        <ValidationResults records={validationResult?.rows || []} filter="valid" />
      </TabsContent>

      <TabsContent value="invalid">
        <ValidationResults records={validationResult?.rows || []} filter="invalid" />
      </TabsContent>
    </Tabs>
  );
};

export default ValidationResultsTabs;
