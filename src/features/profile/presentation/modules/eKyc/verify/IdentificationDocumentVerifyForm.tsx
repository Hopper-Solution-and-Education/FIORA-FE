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
import { useGetIdentificationDocumentByUserIdQuery } from '@/features/profile/store/api/profileApi';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { IdentificationDocument } from '../../../schema/personalInfoSchema';
import { DocumentImagesForm, DocumentInfoForm } from '../identification-document/components';
import { FormHeader, RejectedRemarksField } from '../shared/components';

interface IdentificationDocumentVerifyFormProps {
  eKYCData: eKYC;
  userId: string;
  onApprove: () => void;
  onReject: () => void;
  isVerifying: boolean;
}

const IdentificationDocumentVerifyForm: FC<IdentificationDocumentVerifyFormProps> = ({
  eKYCData,
  userId,
  onApprove,
  onReject,
  isVerifying,
}) => {
  const router = useRouter();
  const { data: existingData, isLoading: isLoadingData } =
    useGetIdentificationDocumentByUserIdQuery(userId, {
      skip: !eKYCData || !userId,
    });

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
        locationImage: null,
        initialLocationImage: identificationDocument?.fileLocation?.url || '',
      };

      reset(formData);
      return;
    }
    reset(defaults);
  }, [identificationDocument, eKYCData, reset, defaults]);

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
          onSubmit={onApprove}
          submitTooltip="Approve eKYC"
          customButton={{
            onClick: onReject,
            tooltip: 'Reject eKYC',
            icon: <Icons.close className="h-5 w-5" />,
            variant: 'destructive',
            disabled: isVerifying,
          }}
          onBack={() => router.back()}
        />
      );
    }

    return <DefaultSubmitButton onBack={() => router.back()} />;
  };

  return (
    <div className="w-full max-w-5xl mx-auto mb-4">
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

      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <form noValidate className="space-y-4 sm:space-y-6">
              <DocumentInfoForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

              <DocumentImagesForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

              {renderSubmitButton()}
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default IdentificationDocumentVerifyForm;
