import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import React from 'react';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import UploadStatusIcon from '@/components/common/atoms/UploadStatusIcon';
import StatsDisplay from '../molecules/StatsDisplay';
import { FaqsImportResult } from '@/features/faqs/domain/entities/models/faqs';

interface ImportCompletionStatusProps {
  importResult: FaqsImportResult;
  onRestart: () => void;
}

const ImportCompletionStatus: React.FC<ImportCompletionStatusProps> = ({
  importResult,
  onRestart,
}) => {
  const router = useRouter();
  const isSuccessful = importResult.failed === 0;
  const hasPartialSuccess = importResult.successful > 0 && importResult.failed > 0;

  const stats = [
    {
      label: 'Total Processed',
      value: importResult.totalProcessed,
      variant: 'default' as const,
    },
    {
      label: 'Successful',
      value: importResult.successful,
      variant: 'success' as const,
    },
    {
      label: 'Failed',
      value: importResult.failed,
      variant: 'error' as const,
    },
  ];

  return (
    <div>
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <UploadStatusIcon
            type={isSuccessful ? 'success' : hasPartialSuccess ? 'warning' : 'error'}
            size="lg"
            className="h-16 w-16"
          />
        </div>
        <CardTitle className="text-2xl">
          {isSuccessful && 'Import Completed Successfully!'}
          {hasPartialSuccess && 'Import Partially Completed'}
          {!isSuccessful && !hasPartialSuccess && 'Import Failed'}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Display */}
        <StatsDisplay stats={stats} />

        <DefaultSubmitButton
          isSubmitting={false}
          disabled={false}
          onSubmit={() => {
            router.push('/faqs');
            setTimeout(() => {
              onRestart();
            }, 1000);
          }}
          onBack={onRestart}
          backTooltip="Import another file"
          submitTooltip="Go to Dashboard"
        />
      </CardContent>
    </div>
  );
};

export default ImportCompletionStatus;
