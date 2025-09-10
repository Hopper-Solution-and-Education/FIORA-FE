'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  eKYC,
  IdentificationDocumentType,
} from '@/features/profile/domain/entities/models/profile';
import {
  useGetIdentificationDocumentQuery,
  useSubmitIdentificationDocumentMutation,
  useUploadAttachmentMutation,
} from '@/features/profile/store/api/profileApi';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { FC, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IdentificationDocument } from '../../../schema/personalInfoSchema';
import {
  DocumentImagesForm,
  DocumentInfoForm,
  IdentificationActions,
  IdentificationHeader,
} from './components';

interface IdentificationDocumentProps {
  eKYCData: eKYC;
}

const IdentificationDocumentForm: FC<IdentificationDocumentProps> = ({ eKYCData }) => {
  const { data: existingData, isLoading: isLoadingData } = useGetIdentificationDocumentQuery(
    undefined,
    { skip: !eKYCData },
  );

  const [submitDocument] = useSubmitIdentificationDocumentMutation();
  const [uploadAttachmentMutation] = useUploadAttachmentMutation();

  const defaults = useMemo(
    () => ({
      idNumber: '',
      issuedDate: '',
      issuedPlace: '',
      idAddress: '',
      type: IdentificationDocumentType.NATIONAL,
      frontImage: null,
      backImage: null,
      facePhoto: null,
      initialFrontImage: '',
      initialBackImage: '',
      initialFacePhoto: '',
    }),
    [],
  );

  const form = useForm<IdentificationDocument>({
    mode: 'onChange',
    defaultValues: defaults,
  });

  const {
    reset,
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  // Populate form with existing data when loaded, or use defaults
  useEffect(() => {
    if (existingData && existingData.length > 0 && eKYCData) {
      const identificationDocument = existingData.find(
        (item: any) => item.type !== IdentificationDocumentType.TAX,
      );

      if (identificationDocument) {
        const formData = {
          idNumber: identificationDocument.idNumber || '',
          issuedDate: identificationDocument.issuedDate
            ? new Date(identificationDocument.issuedDate).toISOString().split('T')[0]
            : '',
          issuedPlace: identificationDocument.issuedPlace || '',
          idAddress: identificationDocument.idAddress || '',
          type: identificationDocument.type as IdentificationDocumentType,
          frontImage: null,
          initialFrontImage: identificationDocument?.fileFront?.url || '',
          backImage: null,
          initialBackImage: identificationDocument?.fileBack?.url || '',
          facePhoto: null,
          initialFacePhoto: identificationDocument?.filePhoto?.url || '',
        };

        console.log('🚀 ~ formData being reset:', formData);
        reset(formData);
        return;
      }
    }
    // If no existing data, reset to defaults
    reset(defaults);
  }, [existingData, eKYCData, reset, defaults]);

  const uploadFile = async (
    file: File,
    fileType: string,
  ): Promise<{ url: string; fileName: string } | null> => {
    try {
      const fileName = `identification-${fileType}-${Date.now()}`;
      const downloadURL = await uploadToFirebase({
        file,
        path: 'ekyc-documents',
        fileName,
      });
      return {
        url: downloadURL,
        fileName: fileName,
      };
    } catch (error) {
      console.error(`Error uploading ${fileType} file:`, error);
      return null;
    }
  };

  const handleSubmitForm = async (data: IdentificationDocument) => {
    // Validate required files (handled by schema now)
    if (!data.frontImage || !data.backImage || !data.facePhoto) {
      toast.error('Please upload all required files.');
      return;
    }
    try {
      // Upload all files
      const [frontUrl, backUrl, photoUrl] = await Promise.all([
        uploadFile(data.frontImage, 'front'),
        uploadFile(data.backImage, 'back'),
        uploadFile(data.facePhoto, 'face'),
      ]);

      if (!frontUrl || !backUrl || !photoUrl) {
        toast.error('Failed to upload some files. Please try again.');
        return;
      }

      // Create attachments
      const [attachmentFront, attachmentBack, attachmentPhoto] = await Promise.all([
        uploadAttachmentMutation({
          url: frontUrl.url,
          path: frontUrl.fileName,
          type: 'image',
        }),
        uploadAttachmentMutation({
          url: backUrl.url,
          path: backUrl.fileName,
          type: 'image',
        }),
        uploadAttachmentMutation({
          url: photoUrl.url,
          path: photoUrl.fileName,
          type: 'image',
        }),
      ]);

      const payload = {
        fileFrontId: attachmentFront?.data?.id,
        fileBackId: attachmentBack?.data?.id,
        filePhotoId: attachmentPhoto?.data?.id,
        idAddress: data.idAddress,
        issuedDate: new Date(data.issuedDate).toISOString(),
        type: data.type,
        idNumber: data.idNumber,
        issuedPlace: data.issuedPlace,
      };

      await submitDocument(payload).unwrap();
      toast.success('Document submitted successfully');
    } catch (error: any) {
      console.error('Error submitting document:', error);
      toast.error(error?.message || 'Failed to submit document');
    }
  };

  const isDisabled = !!eKYCData;

  if (isLoadingData) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto mb-10">
        <IdentificationHeader status={eKYCData?.status} />

        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            noValidate
            className="space-y-4 sm:space-y-6"
          >
            <DocumentInfoForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

            <DocumentImagesForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

            <IdentificationActions
              isLoading={isSubmitting}
              onSubmit={isDisabled ? undefined : handleSubmit(handleSubmitForm)}
            />
          </form>
        </FormProvider>
      </div>
    </TooltipProvider>
  );
};

export default IdentificationDocumentForm;
