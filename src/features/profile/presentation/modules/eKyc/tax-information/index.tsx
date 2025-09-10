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
import { TaxInformation } from '../../../schema/personalInfoSchema';
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

  // Populate form with existing data when loaded
  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  useEffect(() => {
    if (existingData && existingData.length > 0 && eKYCData) {
      const taxInformation = existingData.find(
        (item: any) => item.type === IdentificationDocumentType.TAX,
      );

      if (taxInformation?.idNumber) {
        reset({
          taxId: taxInformation.idNumber,
          taxDocument: null,
          existingAttachmentUrl: taxInformation.filePhoto?.url || '',
          existingFileName: taxInformation.filePhoto?.path || '',
          existingFileType: taxInformation.filePhoto?.type || '',
          existingFileSize: taxInformation.filePhoto?.size || 0,
        });
      }
    }
  }, [existingData, eKYCData, reset]);

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
      toast.success('Tax information submitted successfully');
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
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto">
        <TaxInfoHeader status={eKYCData?.status} />

        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(handleSubmitForm)}
            noValidate
            className="space-y-4 sm:space-y-6"
          >
            <TaxDetailsForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

            <TaxDocumentUpload form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

            <TaxActions
              isLoading={isSubmitting}
              onSubmit={isDisabled ? undefined : handleSubmit(handleSubmitForm)}
            />
          </form>
        </FormProvider>
      </div>
    </TooltipProvider>
  );
};

export default TaxInformationForm;
