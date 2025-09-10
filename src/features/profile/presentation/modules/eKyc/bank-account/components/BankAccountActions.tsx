'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { useRouter } from 'next/navigation';

interface BankAccountActionsProps {
  onSubmit?: () => void;
  isLoading?: boolean;
}

const BankAccountActions: React.FC<BankAccountActionsProps> = ({ onSubmit, isLoading = false }) => {
  const router = useRouter();

  return (
    <DefaultSubmitButton
      isSubmitting={isLoading}
      disabled={isLoading}
      onSubmit={onSubmit}
      submitTooltip="Save & Continue"
      onBack={() => router.push(`/profile/`)}
    />
  );
};

export default BankAccountActions;
