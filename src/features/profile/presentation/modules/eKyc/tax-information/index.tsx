'use client';

import { Skeleton } from '@/components/ui/skeleton';
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
import { TaxInformation } from '../../../schema/personalInfoSchema';
import { ResubmitConfirmModal } from '../components';
import { RejectedRemarksField } from '../shared/components';
import { TaxActions, TaxDetailsForm, TaxDocumentUpload, TaxInfoHeader } from './components';

type Props = {
  eKYCData: eKYC;
};

const TaxInformationForm: FC<Props> = ({ eKYCData }) => {
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
      taxId: '',
      taxDocument: null as File | null,
      existingAttachmentUrl: '',
      existingFileName: '',
      existingFileType: '',
      existingFileSize: 0,
    }),
    [],
  );

  const form = useForm<TaxInformation>({
    mode: 'onChange',
    defaultValues: defaults,
  });

  const {
    reset,
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  // Get tax document
  const taxDocument = useMemo(() => {
    if (!existingData || existingData.length === 0) return null;
    return existingData.find((item: any) => item.type === IdentificationDocumentType.TAX);
  }, [existingData]);

  // Populate form with existing data when loaded
  useEffect(() => {
    if (taxDocument?.idNumber && eKYCData) {
      reset({
        taxId: taxDocument.idNumber,
        taxDocument: null,
        existingAttachmentUrl: taxDocument.filePhoto?.url || '',
        existingFileName: taxDocument.filePhoto?.path || '',
        existingFileType: taxDocument.filePhoto?.type || '',
        existingFileSize: taxDocument.filePhoto?.size || 0,
      });
      return;
    }
    reset(defaults);
  }, [taxDocument, eKYCData, reset, defaults]);

  const uploadFile = async (
    file: File,
    fileType: string,
  ): Promise<{ url: string; fileName: string; size: number; type: string } | null> => {
    try {
      const fileName = `tax-document-${Date.now()}-${file.name}`;
      const downloadURL = await uploadToFirebase({
        file,
        path: 'ekyc-documents/tax-documents',
        fileName,
      });
      return {
        url: downloadURL,
        fileName: fileName,
        size: file.size,
        type: file.type,
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

  const handleSubmitForm = async (data: TaxInformation) => {
    try {
      let documentId: string | undefined;

      // Upload file if exists
      if (data.taxDocument) {
        const fileUrl = await uploadFile(data.taxDocument, 'tax-document');
        if (!fileUrl) {
          toast.error('Failed to upload tax document');
          return;
        }
        if (fileUrl) {
          const type = fileUrl.type === 'application/pdf' ? 'pdf' : 'image';
          const attachmentResult = await uploadAttachmentMutation({
            url: fileUrl.url,
            path: fileUrl.fileName,
            type: type,
            size: fileUrl.size,
          });
          documentId = attachmentResult?.data?.id;
        }
      }

      const payload = {
        type: IdentificationDocumentType.TAX,
        idNumber: data.taxId,
        filePhotoId: documentId || '',
      };

      await submitDocument(payload).unwrap();
      toast.success(
        isRejected
          ? 'Tax information re-submitted successfully'
          : 'Tax information submitted successfully',
      );
    } catch (error: any) {
      console.error('Error submitting tax information:', error);
      toast.error(error?.message || 'Failed to submit tax information');
    }
  };

  const isDisabled = !!eKYCData;

  if (isLoadingData) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <TaxInfoHeader status={eKYCData?.status} />

      {isRejected && taxDocument?.remarks && <RejectedRemarksField remarks={taxDocument.remarks} />}

      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitClick();
          }}
          noValidate
          className="space-y-4 sm:space-y-6"
        >
          <TaxDetailsForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

          <TaxDocumentUpload form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

          <TaxActions
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
        type="tax"
      />
    </div>
  );
};

export default TaxInformationForm;
