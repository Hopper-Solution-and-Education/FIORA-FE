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
import { Calculator } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TaxInformation } from '../../../schema/personalInfoSchema';
import { FormHeader, RejectedRemarksField } from '../shared/components';
import { TaxDetailsForm, TaxDocumentUpload } from '../tax-information/components';

interface TaxInformationVerifyFormProps {
  eKYCData: eKYC;
  userId: string;
  onApprove: () => void;
  onReject: () => void;
  isVerifying: boolean;
}

const TaxInformationVerifyForm: FC<TaxInformationVerifyFormProps> = ({
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
    <div className="w-full max-w-5xl mx-auto">
      <FormHeader
        icon={Calculator}
        title="Tax Information"
        description="Provide your tax details for compliance and reporting purposes"
        iconColor="text-orange-600"
        status={eKYCData?.status}
      />

      {isRejected && taxDocument?.remarks && <RejectedRemarksField remarks={taxDocument.remarks} />}

      <Card>
        <CardContent className="p-6">
          <FormProvider {...form}>
            <form noValidate className="space-y-4 sm:space-y-6">
              <TaxDetailsForm form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

              <TaxDocumentUpload form={form} isLoadingData={isLoadingData} disabled={isDisabled} />

              {renderSubmitButton()}
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaxInformationVerifyForm;
