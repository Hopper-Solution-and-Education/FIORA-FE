'use client';

import DocumentUpload from '@/components/common/forms/upload/DocumentUpload';
import { FileText } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { TaxInformation } from '../../../../schema/personalInfoSchema';

interface TaxDocumentUploadProps {
  form: UseFormReturn<TaxInformation>;
  isLoadingData: boolean;
  disabled?: boolean;
}

const TaxDocumentUpload: React.FC<TaxDocumentUploadProps> = ({
  form,
  isLoadingData,
  disabled = false,
}) => {
  const {
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = form;

  const taxDocument = watch('taxDocument');
  const existingAttachmentUrl = watch('existingAttachmentUrl');
  const existingFileName = watch('existingFileName');
  const existingFileType = watch('existingFileType');
  const existingFileSize = watch('existingFileSize');

  const handleDocumentChange = (file: File | null) => {
    setValue('taxDocument', file);
  };

  return (
    <DocumentUpload
      document={taxDocument || null}
      onDocumentChange={handleDocumentChange}
      title="Tax Registration Certificate"
      icon={FileText}
      iconColor="text-orange-600"
      requirements={[
        'Document should be in good condition and clearly visible',
        'Ensure there is no light glare or shadows on the document',
        'Certificate should be current and not expired',
        'All text and official seals must be readable',
        'File size should not exceed 5MB',
      ]}
      accept="image/jpeg,image/jpg,image/png,image/gif,application/pdf"
      maxSize={5}
      disabled={disabled || isSubmitting || isLoadingData}
      loading={isLoadingData}
      error={errors.taxDocument?.message}
      enableDragDrop={true}
      existingUrl={existingAttachmentUrl}
      existingFileName={existingFileName}
      existingFileType={existingFileType}
      existingFileSize={existingFileSize}
    />
  );
};

export default TaxDocumentUpload;
