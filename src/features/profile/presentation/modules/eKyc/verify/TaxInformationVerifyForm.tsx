'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Icons } from '@/components/Icon';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  eKYC,
  EKYCStatus,
  IdentificationDocumentType,
} from '@/features/profile/domain/entities/models/profile';
import {
  useGetIdentificationDocumentByUserIdQuery,
  useVerifyEKYCMutation,
} from '@/features/profile/store/api/profileApi';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { TaxInformation } from '../../../schema/personalInfoSchema';
import { RejectedRemarksField } from '../shared/components';
import { TaxDetailsForm, TaxDocumentUpload, TaxInfoHeader } from '../tax-information/components';
import { VerifyConfirmModal } from './components';

interface TaxInformationVerifyFormProps {
  eKYCData: eKYC;
  userId: string;
}

const TaxInformationVerifyForm: FC<TaxInformationVerifyFormProps> = ({ eKYCData, userId }) => {
  const { data: existingData, isLoading: isLoadingData } =
    useGetIdentificationDocumentByUserIdQuery(userId, {
      skip: !eKYCData || !userId,
    });
  const [verifyEKYC, { isLoading: isVerifying }] = useVerifyEKYCMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');

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

  const { reset } = form;

  // Get tax document
  const taxDocument = useMemo(() => {
    if (!existingData || existingData.length === 0) return null;
    return existingData.find((item: any) => item.type === IdentificationDocumentType.TAX);
  }, [existingData]);

  // Populate form with existing data
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
  const canVerify = eKYCData?.status === EKYCStatus.PENDING;
  const isRejected = eKYCData?.status === EKYCStatus.REJECTED;

  if (isLoadingData) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <>
      <div className="w-full max-w-5xl mx-auto">
        <TaxInfoHeader status={eKYCData?.status} />

        {isRejected && taxDocument?.remarks && (
          <RejectedRemarksField remarks={taxDocument.remarks} />
        )}

        <Card>
          <CardContent className="p-6">
            <FormProvider {...form}>
              <form noValidate className="space-y-4 sm:space-y-6">
                <TaxDetailsForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

                <TaxDocumentUpload
                  form={form}
                  isLoadingData={isLoadingData}
                  disabled={isDisabled}
                />

                {canVerify && (
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
                  />
                )}

                {!canVerify && eKYCData && (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    This eKYC has already been{' '}
                    {eKYCData.status === EKYCStatus.APPROVAL ? 'approved' : 'processed'}.
                  </div>
                )}
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

export default TaxInformationVerifyForm;
