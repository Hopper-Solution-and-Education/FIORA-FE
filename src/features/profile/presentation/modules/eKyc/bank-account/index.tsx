'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { eKYC, EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import {
  useDeleteEKYCMutation,
  useGetBankAccountQuery,
  useSubmitBankAccountMutation,
  useUpdateBankAccountMutation,
  useUploadAttachmentMutation,
} from '@/features/profile/store/api/profileApi';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { Building2 } from 'lucide-react';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { BankAccount } from '../../../schema/personalInfoSchema';
import { EditApprovedModal, ResubmitConfirmModal } from '../components';
import { EKYCTabActions, FormHeader, RejectedRemarksField } from '../shared/components';
import { BankAccountDetailsForm, BankStatementUpload } from './components';

type Props = {
  eKYCData: eKYC;
};

const BankAccountForm: FC<Props> = ({ eKYCData }) => {
  const { data: existingData, isLoading: isLoadingData } = useGetBankAccountQuery(undefined, {
    skip: !eKYCData,
  });

  const [submitBankAccount] = useSubmitBankAccountMutation();
  const [updateBankAccount] = useUpdateBankAccountMutation();
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
      accountNumber: '',
      accountName: '',
      bankName: '',
      SWIFT: '',
      bankStatement: null as File | null,
      existingAttachmentUrl: '',
      existingFileName: '',
      existingFileType: '',
      existingFileSize: 0,
    }),
    [],
  );

  const form = useForm<BankAccount>({
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
    // Don't populate form with existing data when editing
    if (isEditing) return;

    if (existingData && eKYCData) {
      reset({
        accountNumber: existingData.accountNumber || '',
        accountName: existingData.accountName || '',
        bankName: existingData.bankName || '',
        SWIFT: existingData.SWIFT || '',
        bankStatement: null,
        existingAttachmentUrl: existingData.Attachment?.url || '',
        existingFileName: existingData.Attachment?.path || '',
        existingFileType: existingData.Attachment?.type || '',
        existingFileSize: existingData.Attachment?.size || 0,
      });
      return;
    }
    reset(defaults);
  }, [existingData, eKYCData, reset, defaults, isEditing]);

  const uploadFile = async (
    file: File,
  ): Promise<{ url: string; fileName: string; size: number; type: string } | null> => {
    try {
      const fileName = `bank-statement-${Date.now()}-${file.name}`;
      const downloadURL = await uploadToFirebase({
        file,
        path: 'images/bank-statements',
        fileName,
      });
      return {
        url: downloadURL,
        fileName: fileName,
        size: file.size,
        type: file.type,
      };
    } catch (error) {
      console.error('Error uploading bank statement file:', error);
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
      reset(defaults); // Reset form to defaults for new submission
      toast.success(
        'Previous submission deleted. You can now submit new bank account information.',
      );
    } catch (error: any) {
      console.error('Error deleting eKYC:', error);
      toast.error(error?.message || 'Failed to delete previous submission');
    }
  };

  const handleSubmitForm = async (data: BankAccount) => {
    try {
      let documentId = '';

      if (!isEditing) {
        // New submission - require file
        if (!data.bankStatement) {
          toast.error('Please upload a bank statement.');
          return;
        }

        const fileUrl = await uploadFile(data.bankStatement);
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
        if (data.bankStatement) {
          // Upload new file
          const fileUrl = await uploadFile(data.bankStatement);
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
        } else if (existingData?.Attachment?.id) {
          // Use existing attachment
          documentId = existingData.Attachment.id;
        }
      }

      const payload = {
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        bankName: data.bankName,
        SWIFT: data.SWIFT,
        paymentRefId: documentId,
      };

      // Use update or submit based on whether we're editing an existing document
      if (isEditing) {
        await updateBankAccount({
          ...payload,
          id: existingData?.id,
          ekycId: eKYCData?.id,
        } as any).unwrap();
        toast.success('Bank account information updated successfully');
      } else {
        await submitBankAccount(payload).unwrap();
        toast.success('Bank account information submitted successfully');
      }
      setIsEditing(false); // Reset editing state after successful submit
    } catch (error: any) {
      console.error('Error submitting bank account information:', error);
      toast.error(error?.message || 'Failed to submit bank account information');
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
        icon={Building2}
        title="Bank Account Information"
        description="Add your bank account details for secure transactions"
        iconColor="text-blue-600"
        status={eKYCData?.status}
      />

      {isRejected && existingData?.remarks && (
        <RejectedRemarksField remarks={existingData.remarks} />
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
          <BankAccountDetailsForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

          <BankStatementUpload form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

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
        type="bank"
      />

      <EditApprovedModal
        open={showEditApprovedModal}
        onOpenChange={setShowEditApprovedModal}
        onConfirm={handleEditApprovedConfirm}
        isLoading={isDeleting}
        type="bank"
      />
    </div>
  );
};

export default BankAccountForm;
