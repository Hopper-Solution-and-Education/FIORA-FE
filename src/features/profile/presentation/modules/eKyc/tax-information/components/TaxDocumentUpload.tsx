'use client';

import { FileUpload } from '@/features/profile/presentation/modules/eKyc/shared/components';

interface TaxDocumentUploadProps {
  uploadedFile: File | null;
  onFileUpload: (file: File | null) => void;
  isLoading?: boolean;
  filePhotoUrl: string | null;
}

const TaxDocumentUpload: React.FC<TaxDocumentUploadProps> = ({
  uploadedFile,
  onFileUpload,
  isLoading = false,
  filePhotoUrl,
}) => {
  return (
    <FileUpload
      uploadedFile={uploadedFile}
      onFileUpload={onFileUpload}
      title="Tax Registration Certificate"
      requirements={[
        'Document should be in good condition and clearly visible',
        'Ensure there is no light glare or shadows on the document',
        'Certificate should be current and not expired',
        'All text and official seals must be readable',
        'File size should not exceed 5MB',
      ]}
      placeholder="Upload your tax registration certificate"
      isLoading={isLoading}
      filePhotoUrl={filePhotoUrl}
    />
  );
};

export default TaxDocumentUpload;
