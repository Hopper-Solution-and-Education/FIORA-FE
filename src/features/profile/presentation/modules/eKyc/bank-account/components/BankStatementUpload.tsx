'use client';

import { FileUpload } from '@/features/profile/shared/components';

interface BankStatementUploadProps {
  uploadedFile: File | null;
  onFileUpload: (file: File | null) => void;
  isLoading?: boolean;
}

const BankStatementUpload: React.FC<BankStatementUploadProps> = ({
  uploadedFile,
  onFileUpload,
  isLoading = false,
}) => {
  return (
    <FileUpload
      uploadedFile={uploadedFile}
      onFileUpload={onFileUpload}
      title="Bank Statement"
      requirements={[
        'Document should be in good condition and clearly visible',
        'Ensure there is no light glare or shadows',
        'Statement should be from the last 3 months',
        'File size should not exceed 5MB',
      ]}
      placeholder="Upload your bank statement"
      isLoading={isLoading}
    />
  );
};

export default BankStatementUpload;
