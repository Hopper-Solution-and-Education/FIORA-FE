'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface ImportConfirmationProps {
  validRecords: number;
  totalRecords: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ImportConfirmation = ({
  validRecords,
  totalRecords,
  onConfirm,
  onCancel,
  isLoading,
}: ImportConfirmationProps) => {
  const invalidRecords = totalRecords - validRecords;
  const percentage = Math.round((validRecords / totalRecords) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-medium">Confirm Import</h3>
        </div>

        <p className="mb-4 text-gray-700">
          You are about to import <span className="font-medium">{validRecords}</span> valid records
          out of <span className="font-medium">{totalRecords}</span> total records ({percentage}%).
        </p>

        {invalidRecords > 0 && (
          <div className="bg-amber-50 p-4 rounded-md mb-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-2" />
              <div className="ml-3">
                <h4 className="font-medium text-amber-800">Warning</h4>
                <p className="text-sm text-amber-700">
                  {invalidRecords} records will not be imported due to validation errors
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-gray-700">Only valid records will be imported</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span className="text-gray-700">This action cannot be automatically undone</span>
          </div>
        </div>
      </div>

      <DefaultSubmitButton
        isSubmitting={isLoading}
        disabled={validRecords === 0 || isLoading}
        onSubmit={onConfirm}
        onBack={onCancel}
      />
    </div>
  );
};

export default ImportConfirmation;
