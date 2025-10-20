'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { ArrowLeft, Check } from 'lucide-react';

interface ResubmitConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  type: 'identification' | 'tax' | 'bank' | 'contact';
}

const MODAL_CONTENT = {
  identification: {
    title: 'Re-submit Identification Document',
    description: 'To continue, please re-submit a valid document for identity verification (KYC).',
  },
  tax: {
    title: 'Re-submit Tax Information',
    description: 'To continue, please re-submit valid tax information for verification (KYC).',
  },
  bank: {
    title: 'Re-submit Bank Account',
    description:
      'To continue, please re-submit valid bank account information for verification (KYC).',
  },
  contact: {
    title: 'Re-submit Contact Information',
    description: 'To continue, please re-submit valid contact information for verification (KYC).',
  },
};

const ResubmitConfirmModal = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  type,
}: ResubmitConfirmModalProps) => {
  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  const content = MODAL_CONTENT[type];

  return (
    <GlobalDialog
      open={open}
      onOpenChange={onOpenChange}
      title={content.title}
      description={
        <>
          {content.description}
          <br />
          <span className="font-medium">Are you sure you want to proceed?</span>
        </>
      }
      variant="info"
      type="info"
      hideCancel={true}
      hideConfirm={true}
      isLoading={isLoading}
      className="max-w-md"
      renderContent={() => (
        <div className="flex flex-col items-center text-center">
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
            Click <ArrowLeft className="inline h-3 w-3 mx-0.5 text-gray-500" /> to stay back
            <br />
            Or click <Check className="inline h-3 w-3 mx-0.5 text-green-500" /> to confirm
          </div>
        </div>
      )}
      footer={
        <DefaultSubmitButton
          onBack={handleClose}
          onSubmit={onConfirm}
          isSubmitting={isLoading}
          backTooltip="Cancel and stay back"
          submitTooltip="Confirm re-submit"
          className="mt-0"
        />
      }
    />
  );
};

export default ResubmitConfirmModal;
