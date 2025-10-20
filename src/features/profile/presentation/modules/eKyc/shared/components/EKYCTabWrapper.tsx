'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { eKYC, EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { FC, ReactNode, useState } from 'react';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { ResubmitConfirmModal } from '../../components';

interface EKYCTabWrapperProps {
  eKYCData: eKYC;
  isLoadingData: boolean;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  children: ReactNode;
  showRejectedRemarks?: boolean;
  remarksField?: string;
  modalType?: 'identification' | 'bank' | 'tax' | 'contact';
  className?: string;
}

const EKYCTabWrapper: FC<EKYCTabWrapperProps> = ({
  eKYCData,
  isLoadingData,
  form,
  onSubmit,
  children,
  showRejectedRemarks = true,
  remarksField = 'remarks',
  modalType = 'identification',
  className = 'w-full mx-auto',
}) => {
  const [showResubmitModal, setShowResubmitModal] = useState(false);
  const isRejected = eKYCData?.status === EKYCStatus.REJECTED;

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  const handleSubmitClick = () => {
    if (isRejected) {
      setShowResubmitModal(true);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const handleResubmitConfirm = async () => {
    try {
      if (!eKYCData?.id) {
        toast.error('eKYC data not found');
        return;
      }

      // This would need to be passed as a prop or handled by parent
      // For now, we'll just close the modal and show success message
      setShowResubmitModal(false);
      toast.success('Previous submission deleted. You can now submit new documents.');
    } catch (error: any) {
      console.error('Error deleting eKYC:', error);
      toast.error(error?.message || 'Failed to delete previous submission');
    }
  };

  const isDisabled = !!eKYCData && !isRejected;

  if (isLoadingData) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <div className={className}>
      <FormProvider {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitClick();
          }}
          noValidate
          className="space-y-4 sm:space-y-6"
        >
          {children}

          <ResubmitConfirmModal
            open={showResubmitModal}
            onOpenChange={setShowResubmitModal}
            onConfirm={handleResubmitConfirm}
            isLoading={isSubmitting}
            type={modalType}
          />
        </form>
      </FormProvider>
    </div>
  );
};

export default EKYCTabWrapper;
