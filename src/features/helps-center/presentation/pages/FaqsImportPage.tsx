'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { FAQ_IMPORT_CONSTANTS } from '../../constants';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useFaqsImport } from '../../hooks/useFaqsImport';
import { useValidationStats } from '../../hooks/useValidationStats';
import { downloadTemplate } from '../../utils/exportUtils';
import FileUploadZone from '../molecules/FileUploadZone';
import {
  ImportCompletionStatus,
  ImportConfirmation,
  ValidationResultsTabs,
  ValidationSummaryAlerts,
} from '../organisms';

const FaqsImportPage = () => {
  const {
    step,
    activeTab,
    validationResult,
    importResult,
    isValidating,
    isImporting,
    error,
    handleFileSelect,
    handleImportConfirm,
    navigateTo,
    setTab,
    restart,
  } = useFaqsImport();

  const validationStats = useValidationStats(validationResult);
  const { extractErrorMessage } = useErrorHandler();

  const renderContent = () => {
    switch (step) {
      case 'upload':
        return (
          <FileUploadZone
            onFileSelect={handleFileSelect}
            isLoading={isValidating}
            label="Accepts CSV or Excel files (.csv, .xlsx) up to 2MB"
            accept={{
              [FAQ_IMPORT_CONSTANTS.ALLOWED_TYPES.XLSX]: ['.xlsx'],
              [FAQ_IMPORT_CONSTANTS.ALLOWED_TYPES.CSV]: ['.csv'],
            }}
          />
        );

      case 'validation':
        if (!validationResult) return null;
        return (
          <div className="space-y-6">
            <ValidationSummaryAlerts validationStats={validationStats} />

            <ValidationResultsTabs
              validationResult={validationResult}
              activeTab={activeTab}
              onTabChange={(tab: string) => setTab(tab as any)}
            />

            <DefaultSubmitButton
              isSubmitting={false}
              disabled={!validationStats.canImport}
              onSubmit={() => navigateTo('import')}
              onBack={restart}
            />
          </div>
        );

      case 'import':
        if (!validationResult) return null;
        return (
          <ImportConfirmation
            validRecords={validationResult.validRows}
            totalRecords={validationResult.totalRows}
            onConfirm={handleImportConfirm}
            onCancel={() => navigateTo('validation')}
            isLoading={isImporting}
          />
        );

      case 'complete':
        if (!importResult) return null;
        return <ImportCompletionStatus importResult={importResult} onRestart={restart} />;

      default:
        return null;
    }
  };

  return (
    <div className="px-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">FAQs Import</h1>
        <Button variant="outline" onClick={downloadTemplate}>
          Download Template
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            <span>{extractErrorMessage(error)}</span>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="pt-6">{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default FaqsImportPage;
