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
import { User } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IdentificationDocument } from '../../../schema/personalInfoSchema';
import { EditApprovedModal, ResubmitConfirmModal } from '../components';
import { EKYCTabActions, FormHeader, RejectedRemarksField } from '../shared/components';
import { DocumentImagesForm, DocumentInfoForm } from './components';

interface IdentificationDocumentProps {
  eKYCData: eKYC;
}

const IdentificationDocumentForm: FC<IdentificationDocumentProps> = ({ eKYCData }) => {
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
    // Don't populate form with existing data when editing
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
      };

      reset(formData);
      return;
    }
    // If no existing data, reset to defaults
    reset(defaults);
  }, [identificationDocument, eKYCData, reset, defaults, isEditing]);

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
      setIsEditing(false); // Reset editing state
      reset(defaults); // Reset form to defaults
      toast.success('Previous submission deleted. You can now submit new documents.');
      // Note: Removed window.location.reload() as reset() should handle form state
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
      toast.success('Previous submission deleted. You can now submit new documents.');
      window.location.reload();
      // Note: Form is now enabled for user to enter new data and submit
    } catch (error: any) {
      console.error('Error deleting eKYC:', error);
      toast.error(error?.message || 'Failed to delete previous submission');
    }
  };

  const handleSubmitForm = async (data: IdentificationDocument) => {
    try {
      let frontUrl = null,
        backUrl = null,
        photoUrl = null;
      let attachmentFront = null,
        attachmentBack = null,
        attachmentPhoto = null;

      // For new submissions, require all files
      // For edits, allow using existing files if no new files uploaded
      if (!isEditing) {
        // New submission - require all files
        if (!data.frontImage || !data.backImage || !data.facePhoto) {
          toast.error('Please upload all required files.');
          return;
        }

        // Upload all files for new submission
        const uploadResults = await Promise.all([
          uploadFile(data.frontImage, 'front'),
          uploadFile(data.backImage, 'back'),
          uploadFile(data.facePhoto, 'face'),
        ]);

        [frontUrl, backUrl, photoUrl] = uploadResults;

        if (!frontUrl || !backUrl || !photoUrl) {
          toast.error('Failed to upload some files. Please try again.');
          return;
        }

        // Create new attachments
        const attachmentResults = await Promise.all([
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

        [attachmentFront, attachmentBack, attachmentPhoto] = attachmentResults;
      } else {
        // Edit existing submission - use existing files if no new files uploaded
        // Upload new files if provided
        if (data.frontImage) {
          frontUrl = await uploadFile(data.frontImage, 'front');
          if (frontUrl) {
            attachmentFront = await uploadAttachmentMutation({
              url: frontUrl.url,
              path: frontUrl.fileName,
              type: 'image',
            });
          }
        } else if (identificationDocument?.fileFront?.id) {
          // Use existing front image
          attachmentFront = { data: { id: identificationDocument.fileFront.id } };
        }

        if (data.backImage) {
          backUrl = await uploadFile(data.backImage, 'back');
          if (backUrl) {
            attachmentBack = await uploadAttachmentMutation({
              url: backUrl.url,
              path: backUrl.fileName,
              type: 'image',
            });
          }
        } else if (identificationDocument?.fileBack?.id) {
          // Use existing back image
          attachmentBack = { data: { id: identificationDocument.fileBack.id } };
        }

        if (data.facePhoto) {
          photoUrl = await uploadFile(data.facePhoto, 'face');
          if (photoUrl) {
            attachmentPhoto = await uploadAttachmentMutation({
              url: photoUrl.url,
              path: photoUrl.fileName,
              type: 'image',
            });
          }
        } else if (identificationDocument?.filePhoto?.id) {
          // Use existing photo
          attachmentPhoto = { data: { id: identificationDocument.filePhoto.id } };
        }
      }

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

      // Use update or submit based on whether we're editing an existing document
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
      setIsEditing(false); // Reset editing state after successful submit
    } catch (error: any) {
      console.error('Error submitting document:', error);
      toast.error(error?.message || 'Failed to submit document');
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
