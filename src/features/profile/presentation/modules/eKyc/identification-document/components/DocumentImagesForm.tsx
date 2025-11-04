'use client';

import { CommonTooltip } from '@/components/common/atoms/CommonTooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IdentificationDocumentType } from '@/features/profile/domain/entities/models/profile';
import { FileText, HelpCircle } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { IdentificationDocument } from '../../../../schema/personalInfoSchema';
import BusinessLicenseUpload from './BusinessLicenseUpload';
import NationalIdUpload from './NationalIdUpload';
import PassportUpload from './PassportUpload';

type FormData = IdentificationDocument;

interface DocumentImagesFormProps {
  form: UseFormReturn<FormData>;
  isLoadingData: boolean;
  disabled?: boolean;
}

const DocumentImagesForm: React.FC<DocumentImagesFormProps> = ({
  form,
  isLoadingData,
  disabled = false,
}) => {
  const currentType = form.watch('type');

  const renderUploadComponent = () => {
    switch (currentType) {
      case IdentificationDocumentType.NATIONAL:
        return <NationalIdUpload form={form} isLoadingData={isLoadingData} disabled={disabled} />;
      case IdentificationDocumentType.PASSPORT:
        return <PassportUpload form={form} isLoadingData={isLoadingData} disabled={disabled} />;
      case IdentificationDocumentType.BUSINESS:
        return (
          <BusinessLicenseUpload form={form} isLoadingData={isLoadingData} disabled={disabled} />
        );
      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            Please select a document type to continue
          </div>
        );
    }
  };

  const getTooltipContent = () => {
    if (currentType === IdentificationDocumentType.BUSINESS) {
      return (
        <div className="space-y-1">
          <p>Document Requirements:</p>
          <ul className="text-xs space-y-1">
            <li>• Ensure all information on the business license is readable</li>
            <li>• For office photos, the address must be clearly shown</li>
            <li>• Avoid blurry or low-resolution images</li>
            <li>• File size should not exceed 5MB per document</li>
          </ul>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <p>Document Requirements:</p>
        <ul className="text-xs space-y-1">
          <li>• Document should be in good condition and clearly visible</li>
          <li>• Ensure there is no light glare, shadows, or reflections</li>
          <li>• Do not use screenshots or photocopies</li>
          <li>• All text and details must be readable</li>
          <li>• File size should not exceed 5MB per document</li>
        </ul>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-green-600" />
          <CardTitle className="text-base sm:text-lg">Document Upload</CardTitle>
          <CommonTooltip content={getTooltipContent()}>
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          </CommonTooltip>
        </div>
      </CardHeader>
      <CardContent>{renderUploadComponent()}</CardContent>
    </Card>
  );
};

export default DocumentImagesForm;
