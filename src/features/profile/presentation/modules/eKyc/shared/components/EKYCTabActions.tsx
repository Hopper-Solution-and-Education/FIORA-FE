'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { Edit, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface EKYCTabActionsProps {
  isLoading?: boolean;
  onSubmit?: () => void;
  onEdit?: () => void;
  status?: EKYCStatus;
  isEditing?: boolean;
  showSubmitButton?: boolean;
  submitTooltip?: string;
  backTooltip?: string;
  submitIcon?: React.ReactNode;
  disabled?: boolean;
}

const EKYCTabActions: React.FC<EKYCTabActionsProps> = ({
  isLoading = false,
  onSubmit,
  onEdit,
  status,
  isEditing = false,
  showSubmitButton = true,
  submitTooltip = 'Save & Continue',
  backTooltip = 'Back to Profile',
  submitIcon,
  disabled = false,
}) => {
  const router = useRouter();

  // Determine button behavior based on status and editing state
  const isPending = status === EKYCStatus.PENDING;
  const isApproved = status === EKYCStatus.APPROVAL;
  const isRejected = status === EKYCStatus.REJECTED;

  // If we're currently editing, show submit button
  if (isEditing && onSubmit) {
    return (
      <DefaultSubmitButton
        isSubmitting={isLoading}
        disabled={isLoading || disabled}
        onSubmit={onSubmit}
        onBack={() => router.push('/profile/')}
        submitTooltip="Save Changes"
        backTooltip={backTooltip}
        submitIcon={undefined}
      />
    );
  }

  // For pending status and not editing, show edit button instead of submit
  if (isPending && onEdit) {
    return (
      <DefaultSubmitButton
        isSubmitting={isLoading}
        disabled={isLoading || disabled}
        onSubmit={onEdit}
        onBack={() => router.push('/profile/')}
        submitTooltip="Edit KYC Document"
        backTooltip={backTooltip}
        submitIcon={<Edit className="h-5 w-5" />}
      />
    );
  }

  // For approved status, show edit button that opens confirmation modal
  if (isApproved && onEdit) {
    return (
      <DefaultSubmitButton
        isSubmitting={isLoading}
        disabled={isLoading || disabled}
        onSubmit={onEdit}
        onBack={() => router.push('/profile/')}
        submitTooltip="Edit Approved Document"
        backTooltip={backTooltip}
        submitIcon={<Edit className="h-5 w-5" />}
      />
    );
  }

  if (!showSubmitButton) {
    return (
      <DefaultSubmitButton
        isSubmitting={isLoading}
        disabled={isLoading || disabled}
        onBack={() => router.push('/profile/')}
        backTooltip={backTooltip}
      />
    );
  }

  // Default behavior for rejected or no status
  const finalSubmitTooltip = isRejected ? 'Re-submit KYC' : submitTooltip;
  const finalSubmitIcon =
    submitIcon || (isRejected ? <RefreshCcw className="h-5 w-5" /> : undefined);

  return (
    <DefaultSubmitButton
      isSubmitting={isLoading}
      disabled={isLoading || disabled}
      onSubmit={onSubmit}
      onBack={() => router.push('/profile/')}
      submitTooltip={finalSubmitTooltip}
      backTooltip={backTooltip}
      submitIcon={finalSubmitIcon}
    />
  );
};

export default EKYCTabActions;
