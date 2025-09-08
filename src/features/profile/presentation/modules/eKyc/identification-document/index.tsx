'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { IdentificationDocumentProps } from '@/features/profile/domain/entities/models/profile';
import { FC } from 'react';
import {
  DocumentImagesForm,
  DocumentInfoForm,
  IdentificationActions,
  IdentificationHeader,
} from './components';
import { useFileUpload, useIdentificationForm } from './hooks';

const IdentificationDocumentForm: FC<IdentificationDocumentProps> = ({ isVerified }) => {
  const {
    formData,
    handleInputChange,
    isLoading,
    setIsLoading,
    isSubmitting,
    isLoadingData,
    submitDocument,
    uploadAttachmentMutation,
  } = useIdentificationForm({ isVerified });

  const {
    frontImageUrl,
    setFrontImageUrl,
    backImageUrl,
    setBackImageUrl,
    facePhotoUrl,
    setFacePhotoUrl,
    submitIdentificationDocument,
  } = useFileUpload();

  const handleSubmit = () => {
    submitIdentificationDocument(formData, uploadAttachmentMutation, submitDocument, setIsLoading);
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto mb-10">
        <IdentificationHeader />

        <div className="space-y-4 sm:space-y-6">
          <DocumentInfoForm
            formData={formData}
            onInputChange={handleInputChange}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            isLoadingData={isLoadingData}
          />

          <DocumentImagesForm
            frontImageUrl={frontImageUrl}
            backImageUrl={backImageUrl}
            facePhotoUrl={facePhotoUrl}
            onFrontImageChange={setFrontImageUrl}
            onBackImageChange={setBackImageUrl}
            onFacePhotoChange={setFacePhotoUrl}
            isSubmitting={isSubmitting}
            isLoadingData={isLoadingData}
          />

          <IdentificationActions isLoading={isLoading} onSubmit={handleSubmit} />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default IdentificationDocumentForm;
