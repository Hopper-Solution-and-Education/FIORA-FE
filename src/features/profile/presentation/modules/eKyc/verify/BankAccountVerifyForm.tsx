'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { Icons } from '@/components/Icon';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { eKYC, EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { useGetBankAccountByUserIdQuery } from '@/features/profile/store/api/profileApi';
import { Building2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { BankAccount } from '../../../schema/personalInfoSchema';
import { BankAccountDetailsForm, BankStatementUpload } from '../bank-account/components';
import { FormHeader, RejectedRemarksField } from '../shared/components';

interface BankAccountVerifyFormProps {
  eKYCData: eKYC;
  userId: string;
  onApprove: () => void;
  onReject: () => void;
  isVerifying: boolean;
}

const BankAccountVerifyForm: FC<BankAccountVerifyFormProps> = ({
  eKYCData,
  userId,
  onApprove,
  onReject,
  isVerifying,
}) => {
  const router = useRouter();
  const { data: existingData, isLoading: isLoadingData } = useGetBankAccountByUserIdQuery(userId, {
    skip: !eKYCData || !userId,
  });

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
        icon={Building2}
        title="Bank Account Information"
        description="Add your bank account details for secure transactions"
        iconColor="text-blue-600"
        status={eKYCData?.status}
      />

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
  );
};

export default BankAccountVerifyForm;
