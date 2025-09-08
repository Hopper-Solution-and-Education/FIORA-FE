'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { eKYC } from '@/features/profile/domain/entities/models/profile';
import { FC } from 'react';
import {
  DocumentImagesForm,
  DocumentInfoForm,
  IdentificationActions,
  IdentificationHeader,
} from './components';
import { useFileUpload, useIdentificationForm } from './hooks';

interface IdentificationDocumentProps {
  eKYCData: eKYC;
}

const IdentificationDocumentForm: FC<IdentificationDocumentProps> = ({ eKYCData }) => {
  const {
    formData,
    handleInputChange,
    isLoading,
    setIsLoading,
    isSubmitting,
    isLoadingData,
    submitDocument,
    uploadAttachmentMutation,
  } = useIdentificationForm({
    eKYCData,
    setImageUrlState: (key, url) => setImageUrlState((prev) => ({ ...prev, [key]: url })),
  });

  const { imageUrlState, setImageUrlState, submitIdentificationDocument } = useFileUpload();

  const handleSubmit = () => {
    submitIdentificationDocument(formData, uploadAttachmentMutation, submitDocument, setIsLoading);
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto mb-10">
        <IdentificationHeader status={eKYCData?.status} />

        <div className="space-y-4 sm:space-y-6">
          <DocumentInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            isLoadingData={isLoadingData}
            disabled={!!eKYCData}
          />

          <DocumentImagesForm
            imageUrlState={imageUrlState}
            setImageUrlState={(key, url) => setImageUrlState((prev) => ({ ...prev, [key]: url }))}
            isSubmitting={isSubmitting}
            isLoadingData={isLoadingData}
            disabled={!!eKYCData}
          />

          <IdentificationActions
            isLoading={isLoading}
            onSubmit={eKYCData ? undefined : handleSubmit}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default IdentificationDocumentForm;
