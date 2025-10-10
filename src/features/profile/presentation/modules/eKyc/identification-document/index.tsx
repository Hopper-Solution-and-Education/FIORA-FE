'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  eKYC,
  EKYCStatus,
  IdentificationDocumentType,
} from '@/features/profile/domain/entities/models/profile';
import {
  useDeleteEKYCMutation,
  useGetIdentificationDocumentQuery,
  useSubmitIdentificationDocumentMutation,
  useUploadAttachmentMutation,
} from '@/features/profile/store/api/profileApi';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IdentificationDocument } from '../../../schema/personalInfoSchema';
import { ResubmitConfirmModal } from '../components';
import { RejectedRemarksField } from '../shared/components';
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
  const [deleteEKYC, { isLoading: isDeleting }] = useDeleteEKYCMutation();

  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const isRejected = eKYCData?.status === EKYCStatus.REJECTED;

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

  // Get identification document (not TAX)
  const identificationDocument = useMemo(() => {
    if (!existingData || existingData.length === 0) return null;
    return existingData.find((item: any) => item.type !== IdentificationDocumentType.TAX);
  }, [existingData]);

  // Populate form with existing data when loaded, or use defaults
  useEffect(() => {
    if (identificationDocument && eKYCData) {
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

      reset(formData);
      return;
    }
    // If no existing data, reset to defaults
    reset(defaults);
  }, [identificationDocument, eKYCData, reset, defaults]);

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

  const handleResubmitConfirm = async () => {
    try {
      if (!eKYCData?.id) {
        toast.error('eKYC data not found');
        return;
      }

      await deleteEKYC(eKYCData.id).unwrap();
      setShowResubmitModal(false);
      reset(defaults);
      toast.success('Previous submission deleted. You can now submit new documents.');
    } catch (error: any) {
      console.error('Error deleting eKYC:', error);
      toast.error(error?.message || 'Failed to delete previous submission');
    }
  };

  const handleSubmitClick = () => {
    if (isRejected) {
      setShowResubmitModal(true);
    } else {
      handleSubmit(handleSubmitForm)();
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
      toast.success(
        isRejected ? 'Document re-submitted successfully' : 'Document submitted successfully',
      );
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
      <div className="w-full max-w-5xl mx-auto">
        <IdentificationHeader status={eKYCData?.status} />

        {isRejected && identificationDocument?.remarks && (
          <RejectedRemarksField remarks={identificationDocument.remarks} />
        )}

        <FormProvider {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitClick();
            }}
            noValidate
            className="space-y-4 sm:space-y-6"
          >
            <DocumentInfoForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

            <DocumentImagesForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

            <IdentificationActions
              isLoading={isSubmitting || isDeleting}
              onSubmit={isDisabled ? undefined : handleSubmitClick}
              isRejected={isRejected}
            />
          </form>
        </FormProvider>

        <ResubmitConfirmModal
          open={showResubmitModal}
          onOpenChange={setShowResubmitModal}
          onConfirm={handleResubmitConfirm}
          isLoading={isDeleting}
          type="identification"
        />
      </div>
    </TooltipProvider>
  );
};

export default IdentificationDocumentForm;
