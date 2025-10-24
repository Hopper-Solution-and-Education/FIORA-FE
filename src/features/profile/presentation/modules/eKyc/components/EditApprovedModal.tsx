'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { GlobalDialog } from '@/components/common/molecules/GlobalDialog';
import { ArrowLeft, Check } from 'lucide-react';

interface EditApprovedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  type: 'identification' | 'tax' | 'bank';
}

const MODAL_CONTENT = {
  identification: {
    title: 'Edit Approved Identity Document',
    description:
      'This action will delete your current approved eKYC and allow you to submit a new one for verification.',
  },
  tax: {
    title: 'Edit Approved Tax Information',
    description:
      'This action will delete your current approved tax information and allow you to submit new details for verification.',
  },
  bank: {
    title: 'Edit Approved Bank Account',
    description:
      'This action will delete your current approved bank account information and allow you to submit new details for verification.',
  },
};

const EditApprovedModal = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  type,
}: EditApprovedModalProps) => {
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
      variant="warning"
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
          submitTooltip="Confirm edit approved document"
          className="mt-0"
        />
      }
    />
  );
};

export default EditApprovedModal;
