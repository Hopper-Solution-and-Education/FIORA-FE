'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Icons } from '@/components/Icon';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { eKYC, EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import {
  useGetBankAccountByUserIdQuery,
  useVerifyEKYCMutation,
} from '@/features/profile/store/api/profileApi';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { BankAccount } from '../../../schema/personalInfoSchema';
import {
  BankAccountDetailsForm,
  BankAccountHeader,
  BankStatementUpload,
} from '../bank-account/components';
import { RejectedRemarksField } from '../shared/components';
import { VerifyConfirmModal } from './components';

interface BankAccountVerifyFormProps {
  eKYCData: eKYC;
  userId: string;
}

const BankAccountVerifyForm: FC<BankAccountVerifyFormProps> = ({ eKYCData, userId }) => {
  const router = useRouter();
  const { data: existingData, isLoading: isLoadingData } = useGetBankAccountByUserIdQuery(userId, {
    skip: !eKYCData || !userId,
  });
  const [verifyEKYC, { isLoading: isVerifying }] = useVerifyEKYCMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');

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

  const { reset } = form;

  // Populate form with existing data
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

  const handleOpenApprove = () => {
    setModalType('approve');
    setModalOpen(true);
  };

  const handleOpenReject = () => {
    setModalType('reject');
    setModalOpen(true);
  };

  const handleVerify = async (remarks?: string) => {
    if (!eKYCData?.id) {
      toast.error('eKYC data not found');
      return;
    }

    try {
      const status = modalType === 'approve' ? EKYCStatus.APPROVAL : EKYCStatus.REJECTED;
      await verifyEKYC({
        kycId: eKYCData.id,
        status,
        remarks: remarks || '',
      }).unwrap();

      toast.success(
        modalType === 'approve' ? 'eKYC approved successfully' : 'eKYC rejected successfully',
      );
      setModalOpen(false);
    } catch (error: any) {
      console.error('Error verifying eKYC:', error);
      toast.error(error?.message || 'Failed to verify eKYC');
    }
  };

  const isDisabled = true; // Always disabled for admin view
  const isPending = eKYCData?.status === EKYCStatus.PENDING;
  const isRejected = eKYCData?.status === EKYCStatus.REJECTED;

  if (isLoadingData) {
    return <Skeleton className="w-full h-96" />;
  }

  const renderSubmitButton = () => {
    if (isPending) {
      return (
        <DefaultSubmitButton
          isSubmitting={isVerifying}
          disabled={isVerifying}
          onSubmit={handleOpenApprove}
          submitTooltip="Approve eKYC"
          customButton={{
            onClick: handleOpenReject,
            tooltip: 'Reject eKYC',
            icon: <Icons.close className="h-5 w-5" />,
            variant: 'destructive',
            disabled: isVerifying,
          }}
          onBack={() => {
            router.back();
          }}
        />
      );
    }

    // if (isRejected) {
    //   return (
    //     <DefaultSubmitButton
    //       isSubmitting={isVerifying}
    //       disabled={isVerifying}
    //       onSubmit={handleOpenReject}
    //       submitTooltip="Re-submit eKYC"
    //       onBack={() => {
    //         router.back();
    //       }}
    //     />
    //   );
    // }

    return (
      <DefaultSubmitButton
        onBack={() => {
          router.back();
        }}
      />
    );
  };

  return (
    <>
      <div className="w-full mx-auto">
        <BankAccountHeader status={eKYCData?.status} />

        {isRejected && existingData?.remarks && (
          <RejectedRemarksField remarks={existingData.remarks} />
        )}

        <Card>
          <CardContent className="p-6">
            <FormProvider {...form}>
              <form noValidate className="space-y-4 sm:space-y-6">
                <BankAccountDetailsForm
                  form={form}
                  isLoadingData={isLoadingData}
                  disabled={isDisabled}
                />

                <BankStatementUpload
                  form={form}
                  isLoadingData={isLoadingData}
                  disabled={isDisabled}
                />

                {renderSubmitButton()}
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>

      <VerifyConfirmModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type={modalType}
        onConfirm={handleVerify}
        isLoading={isVerifying}
      />
    </>
  );
};

export default BankAccountVerifyForm;
