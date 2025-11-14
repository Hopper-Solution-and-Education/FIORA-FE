'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
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
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IdentificationDocument } from '../../../schema/personalInfoSchema';
import { EditApprovedModal, ResubmitConfirmModal } from '../components';
import { EKYCTabActions, FormHeader, RejectedRemarksField } from '../shared/components';
import { DocumentImagesForm, DocumentInfoForm } from './components';
import {
  buildSubmitPayload,
  uploadEditSubmissionFiles,
  uploadNewSubmissionFiles,
  validateRequiredFiles,
} from './helpers';

interface IdentificationDocumentProps {
  eKYCData: eKYC;
}

const IdentificationDocumentForm: FC<IdentificationDocumentProps> = ({ eKYCData }) => {
  const router = useRouter();

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
      idNumber: '',
      issuedDate: '',
      issuedPlace: '',
      idAddress: '',
      type: IdentificationDocumentType.NATIONAL,
      frontImage: null,
      backImage: null,
      facePhoto: null,
      locationImage: null,
      initialFrontImage: '',
      initialBackImage: '',
      initialFacePhoto: '',
      initialLocationImage: '',
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

  const identificationDocument = useMemo(() => {
    if (!existingData || existingData.length === 0) return null;
    return existingData.find((item: any) => item.type !== IdentificationDocumentType.TAX);
  }, [existingData]);

  useEffect(() => {
    if (isEditing) return;

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
        locationImage: null,
        initialLocationImage: identificationDocument?.fileLocation?.url || '',
      };

      reset(formData);
      return;
    }

    reset(defaults);
  }, [identificationDocument, eKYCData, reset, defaults, isEditing]);

  const handleResubmitConfirm = async () => {
    try {
      if (!eKYCData?.id) {
        toast.error('eKYC data not found');
        return;
      }

      await deleteEKYC(eKYCData.id).unwrap();
      setShowResubmitModal(false);
      setIsEditing(false);
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

  const handleEditClick = () => {
    if (isApproved) {
      setShowEditApprovedModal(true);
    } else if (isPending) {
      setIsEditing(true);
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
      toast.success('Previous submission deleted. You can now submit new documents.');
      window.location.reload();
    } catch (error: any) {
      console.error('Error deleting eKYC:', error);
      toast.error(error?.message || 'Failed to delete previous submission');
    }
  };

  const handleSubmitForm = async (data: IdentificationDocument) => {
    try {
      const documentType = data.type;

      // Validate required files for new submission
      if (!isEditing && !validateRequiredFiles(documentType, data)) {
        return;
      }

      // Upload files
      const attachments = isEditing
        ? await uploadEditSubmissionFiles(
            documentType,
            data,
            identificationDocument,
            uploadAttachmentMutation,
          )
        : await uploadNewSubmissionFiles(documentType, data, uploadAttachmentMutation);

      if (!attachments) return;

      // Build payload
      const payload = buildSubmitPayload(documentType, data, attachments);

      // Submit or update
      if (isEditing) {
        await updateDocument({
          ...payload,
          id: existingData?.id,
          ekycId: eKYCData?.id,
        } as any).unwrap();
        toast.success('Document updated successfully');
      } else {
        await submitDocument(payload).unwrap();
        toast.success(
          isRejected ? 'Document re-submitted successfully' : 'Document submitted successfully',
        );
      }

      setIsEditing(false);
    } catch (error: any) {
      console.error('Error submitting document:', error);
      toast.error(error?.message || 'Failed to submit document');
    }
  };

  const isDisabled = (() => {
    if (!eKYCData) return false;
    if (isRejected) return true;
    if (isPending || isApproved) return !isEditing;
    return false;
  })();

  if (isLoadingData) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <FormHeader
        icon={User}
        title="Identity Verification"
        description="Upload your identification documents for account verification"
        iconColor="text-purple-600"
        status={eKYCData?.status}
      />

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

          {isApproved ? (
            <DefaultSubmitButton
              onBack={() => router.push('/profile/')}
              backTooltip="Back to Profile"
            />
          ) : (
            <EKYCTabActions
              isLoading={isSubmitting || isDeleting}
              onSubmit={handleSubmitClick}
              onEdit={handleEditClick}
              status={eKYCData?.status}
              isEditing={isEditing}
            />
          )}
        </form>
      </FormProvider>

      <ResubmitConfirmModal
        open={showResubmitModal}
        onOpenChange={setShowResubmitModal}
        onConfirm={handleResubmitConfirm}
        isLoading={isDeleting}
        type="identification"
      />

      <EditApprovedModal
        open={showEditApprovedModal}
        onOpenChange={setShowEditApprovedModal}
        onConfirm={handleEditApprovedConfirm}
        isLoading={isDeleting}
        type="identification"
      />
    </div>
  );
};

export default IdentificationDocumentForm;
