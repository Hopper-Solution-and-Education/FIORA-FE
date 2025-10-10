'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { TooltipProvider } from '@/components/ui/tooltip';
import { eKYC, EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import {
  useDeleteEKYCMutation,
  useGetBankAccountQuery,
  useSubmitBankAccountMutation,
  useUploadAttachmentMutation,
} from '@/features/profile/store/api/profileApi';
import { uploadToFirebase } from '@/shared/lib/firebase/firebaseUtils';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { BankAccount } from '../../../schema/personalInfoSchema';
import { ResubmitConfirmModal } from '../components';
import { RejectedRemarksField } from '../shared/components';
import {
  BankAccountActions,
  BankAccountDetailsForm,
  BankAccountHeader,
  BankStatementUpload,
} from './components';

type Props = {
  eKYCData: eKYC;
};

const BankAccountForm: FC<Props> = ({ eKYCData }) => {
  const { data: existingData, isLoading: isLoadingData } = useGetBankAccountQuery(undefined, {
    skip: !eKYCData,
  });

  const [submitBankAccount] = useSubmitBankAccountMutation();
  const [uploadAttachmentMutation] = useUploadAttachmentMutation();
  const [deleteEKYC, { isLoading: isDeleting }] = useDeleteEKYCMutation();

  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const isRejected = eKYCData?.status === EKYCStatus.REJECTED;

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
  }, [existingData, eKYCData, reset, defaults]);

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

  const handleSubmitForm = async (data: BankAccount) => {
    try {
      let documentId = '';

      // Upload file if exists
      if (data.bankStatement) {
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
      }

      const payload = {
        accountNumber: data.accountNumber,
        accountName: data.accountName,
        bankName: data.bankName,
        SWIFT: data.SWIFT,
        paymentRefId: documentId,
      };

      await submitBankAccount(payload).unwrap();
      toast.success(
        isRejected
          ? 'Bank account re-submitted successfully'
          : 'Bank account information submitted successfully',
      );
    } catch (error: any) {
      console.error('Error submitting bank account information:', error);
      toast.error(error?.message || 'Failed to submit bank account information');
    }
  };

  const isDisabledSubmit = !!eKYCData && !isRejected;

  if (isLoadingData) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <TooltipProvider>
      <div className="w-full max-w-5xl mx-auto">
        <BankAccountHeader status={eKYCData?.status} />

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
            <BankAccountDetailsForm
              form={form}
              isLoadingData={isLoadingData}
              disabled={!!eKYCData}
            />

            <BankStatementUpload form={form} isLoadingData={isLoadingData} disabled={!!eKYCData} />

            <BankAccountActions
              isLoading={isSubmitting || isDeleting}
              onSubmit={isDisabledSubmit ? undefined : handleSubmitClick}
              isRejected={isRejected}
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
      </div>
    </TooltipProvider>
  );
};

export default BankAccountForm;
