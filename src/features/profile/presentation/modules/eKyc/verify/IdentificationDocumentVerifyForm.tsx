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
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { IdentificationDocument } from '../../../schema/personalInfoSchema';
import {
  DocumentImagesForm,
  DocumentInfoForm,
  IdentificationHeader,
} from '../identification-document/components';
import { RejectedRemarksField } from '../shared/components';
import { VerifyConfirmModal } from './components';

interface IdentificationDocumentVerifyFormProps {
  eKYCData: eKYC;
  userId: string;
}

const IdentificationDocumentVerifyForm: FC<IdentificationDocumentVerifyFormProps> = ({
  eKYCData,
  userId,
}) => {
  const router = useRouter();
  const { data: existingData, isLoading: isLoadingData } =
    useGetIdentificationDocumentByUserIdQuery(userId, {
      skip: !eKYCData || !userId,
    });
  const [verifyEKYC, { isLoading: isVerifying }] = useVerifyEKYCMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'approve' | 'reject'>('approve');

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

  const { reset } = form;

  // Get identification document (not TAX)
  const identificationDocument = useMemo(() => {
    if (!existingData || existingData.length === 0) return null;
    return existingData.find((item: any) => item.type !== IdentificationDocumentType.TAX);
  }, [existingData]);

  // Populate form with existing data
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
    reset(defaults);
  }, [identificationDocument, eKYCData, reset, defaults]);

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
      <div className="w-full max-w-5xl mx-auto mb-4">
        <IdentificationHeader status={eKYCData?.status} />

        {isRejected && identificationDocument?.remarks && (
          <RejectedRemarksField remarks={identificationDocument.remarks} />
        )}

        <Card>
          <CardContent className="p-6">
            <FormProvider {...form}>
              <form noValidate className="space-y-4 sm:space-y-6">
                <DocumentInfoForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

                <DocumentImagesForm
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

export default IdentificationDocumentVerifyForm;
