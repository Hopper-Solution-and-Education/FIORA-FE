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
  useUpdateIdentificationDocumentMutation,
  useUploadAttachmentMutation,
} from '@/features/profile/store/api/profileApi';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { Calculator } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { TaxInformation } from '../../../schema/personalInfoSchema';
import { EditApprovedModal, ResubmitConfirmModal } from '../components';
import { EKYCTabActions, FormHeader, RejectedRemarksField } from '../shared/components';
import { TaxDetailsForm, TaxDocumentUpload } from './components';

type Props = {
  eKYCData: eKYC;
};

const TaxInformationForm: FC<Props> = ({ eKYCData }) => {
  const { data: existingData, isLoading: isLoadingData } = useGetIdentificationDocumentQuery(
    undefined,
    { skip: !eKYCData },
  );

  const [submitDocument] = useSubmitIdentificationDocumentMutation();
  const [updateDocument] = useUpdateIdentificationDocumentMutation();
  const [uploadAttachmentMutation] = useUploadAttachmentMutation();
  const [deleteEKYC, { isLoading: isDeleting }] = useDeleteEKYCMutation();

  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const [showEditApprovedModal, setShowEditApprovedModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isRejected = eKYCData?.status === EKYCStatus.REJECTED;
  const isPending = eKYCData?.status === EKYCStatus.PENDING;
  const isApproved = eKYCData?.status === EKYCStatus.APPROVAL;

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
    // Don't populate form with existing data when editing
    if (isEditing) return;

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
  }, [taxDocument, eKYCData, reset, defaults, isEditing]);

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
      setIsEditing(false); // Reset editing state
      reset(defaults); // Reset form to defaults
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

  const handleEditClick = () => {
    if (isApproved) {
      setShowEditApprovedModal(true);
    } else if (isPending) {
      setIsEditing(true); // Enable editing for pending status
    }
  };

  const handleEditApprovedConfirm = async () => {
    try {
      if (!eKYCData?.id) {
        toast.error('eKYC data not found');
        return;
      }

      await deleteEKYC(eKYCData.id).unwrap();
      setShowEditApprovedModal(false);
      setIsEditing(true); // Enable editing after deleting approved eKYC
      reset(defaults); // Reset form to defaults for new submission
      toast.success('Previous submission deleted. You can now submit new tax information.');
    } catch (error: any) {
      console.error('Error deleting eKYC:', error);
      toast.error(error?.message || 'Failed to delete previous submission');
    }
  };

  const handleSubmitForm = async (data: TaxInformation) => {
    try {
      let documentId: string | undefined;

      // For new submissions, require file
      // For edits, allow using existing file if no new file uploaded
      const isNewSubmission = !eKYCData || isEditing;

      if (isNewSubmission) {
        // New submission - require file
        if (!data.taxDocument) {
          toast.error('Please upload a tax document.');
          return;
        }

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
      } else {
        // Edit existing submission - use existing file if no new file uploaded
        if (data.taxDocument) {
          // Upload new file
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
        } else if (taxDocument?.filePhoto?.id) {
          // Use existing attachment
          documentId = taxDocument.filePhoto.id;
        }
      }

      const payload = {
        ...(isNewSubmission ? {} : { id: taxDocument?.id }), // Include document ID for update
        type: IdentificationDocumentType.TAX,
        idNumber: data.taxId,
        filePhotoId: documentId || '',
      };

      // Use update or submit based on whether we're editing an existing document
      if (payload.id) {
        await updateDocument(payload as any).unwrap();
        toast.success('Tax information updated successfully');
      } else {
        await submitDocument(payload).unwrap();
        toast.success('Tax information submitted successfully');
      }
      setIsEditing(false); // Reset editing state after successful submit
    } catch (error: any) {
      console.error('Error submitting tax information:', error);
      toast.error(error?.message || 'Failed to submit tax information');
    }
  };

  // Enhanced disabled logic based on status and editing state
  const isDisabled = (() => {
    if (!eKYCData) return false; // No data - allow input
    if (isRejected) return true; // Rejected - keep disabled
    if (isPending || isApproved) return !isEditing; // Pending/Approved - disabled unless editing
    return false; // Fallback
  })();

  if (isLoadingData) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <div className="w-full mx-auto">
      <FormHeader
        icon={Calculator}
        title="Tax Information"
        description="Provide your tax details for compliance and reporting purposes"
        iconColor="text-orange-600"
        status={eKYCData?.status}
      />

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

          <EKYCTabActions
            isLoading={isSubmitting || isDeleting}
            onSubmit={handleSubmitClick}
            onEdit={handleEditClick}
            status={eKYCData?.status}
            isEditing={isEditing}
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

      <EditApprovedModal
        open={showEditApprovedModal}
        onOpenChange={setShowEditApprovedModal}
        onConfirm={handleEditApprovedConfirm}
        isLoading={isDeleting}
        type="tax"
      />
    </div>
  );
};

export default TaxInformationForm;
