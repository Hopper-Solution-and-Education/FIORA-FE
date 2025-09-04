'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';

interface BankAccountActionsProps {
  onSubmit: () => void;
  onBack?: () => void;
  isLoading?: boolean;
}

const BankAccountActions: React.FC<BankAccountActionsProps> = ({
  onSubmit,
  onBack,
  isLoading = false,
}) => {
  return (
    <DefaultSubmitButton
      isSubmitting={isLoading}
      disabled={isLoading}
      onSubmit={onSubmit}
      onBack={onBack}
      submitTooltip="Save & Continue"
      backTooltip="Go back to previous step"
    />
  );
};

export default BankAccountActions;
