'use client';

import DocumentUpload from '@/components/common/forms/upload/DocumentUpload';
import { CreditCard } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { BankAccount } from '../../../../schema/personalInfoSchema';

interface BankStatementUploadProps {
  form: UseFormReturn<BankAccount>;
  isLoadingData: boolean;
  disabled?: boolean;
}

const BankStatementUpload: React.FC<BankStatementUploadProps> = ({
  form,
  isLoadingData,
  disabled = false,
}) => {
  const {
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = form;

  const bankStatement = watch('bankStatement');
  const existingAttachmentUrl = watch('existingAttachmentUrl');
  const existingFileName = watch('existingFileName');
  const existingFileType = watch('existingFileType');
  const existingFileSize = watch('existingFileSize');

  const handleDocumentChange = (file: File | null) => {
    setValue('bankStatement', file);
  };

  return (
    <DocumentUpload
      document={bankStatement || null}
      onDocumentChange={handleDocumentChange}
      title="Bank Transfer Receipt"
      icon={CreditCard}
      iconColor="text-blue-600"
      requirements={[
        'Document should be in good condition and clearly visible',
        'Ensure there is no light glare or shadows on the document',
        'Statement should be from the last 3 months',
        'All text and bank details must be readable',
        'File size should not exceed 5MB',
      ]}
      accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf"
      maxSize={5}
      disabled={disabled || isSubmitting || isLoadingData}
      loading={isLoadingData}
      error={errors.bankStatement?.message}
      enableDragDrop={true}
      existingUrl={existingAttachmentUrl}
      existingFileName={existingFileName}
      existingFileType={existingFileType}
      existingFileSize={existingFileSize}
    />
  );
};

export default BankStatementUpload;
