'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { UserProfile } from '@/features/profile/domain/entities/models/profile';
import { FC } from 'react';
import { TaxActions, TaxDetailsForm, TaxDocumentUpload, TaxInfoHeader } from './components';
import { useTaxForm, useTaxUpload } from './hooks';

type Props = {
  profile: UserProfile;
  isVerified: boolean;
};

const TaxInformationForm: FC<Props> = ({ isVerified }) => {
  const {
    taxId,
    handleTaxIdChange,
    isLoading,
    isSubmitting,
    submitTaxInformation,
    uploadFileHelper,
    uploadAttachmentMutation,
  } = useTaxForm({ isVerified });

  const { uploadedFile, handleFileUpload } = useTaxUpload();

  const handleSaveContinue = async () => {
    let documentId: string | undefined;

    // Upload file if exists
    if (uploadedFile) {
      const fileUrl = await uploadFileHelper(uploadedFile);
      if (fileUrl) {
        const attachmentResult = await uploadAttachmentMutation({
          url: fileUrl,
          path: 'images/tax-documents',
          type: 'image',
        });
        documentId = attachmentResult?.data?.id;
      }
    }

    await submitTaxInformation(documentId);
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto">
        <TaxInfoHeader />

        <div className="space-y-4 sm:space-y-6">
          <TaxDetailsForm
            taxId={taxId}
            onTaxIdChange={handleTaxIdChange}
            isLoading={isLoading || isSubmitting}
          />

          <TaxDocumentUpload
            uploadedFile={uploadedFile}
            onFileUpload={handleFileUpload}
            isLoading={isLoading || isSubmitting}
          />

          <TaxActions onSubmit={handleSaveContinue} isLoading={isLoading || isSubmitting} />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default TaxInformationForm;
