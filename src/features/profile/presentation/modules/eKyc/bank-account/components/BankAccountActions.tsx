'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BankAccountActionsProps {
  onSubmit?: () => void;
  isLoading?: boolean;
  isRejected?: boolean;
}

const BankAccountActions: React.FC<BankAccountActionsProps> = ({
  onSubmit,
  isLoading = false,
  isRejected = false,
}) => {
  const router = useRouter();

  return (
    <DefaultSubmitButton
      isSubmitting={isLoading}
      disabled={isLoading}
      onSubmit={onSubmit}
      submitTooltip={isRejected ? 'Re-submit KYC' : 'Save & Continue'}
      onBack={() => router.push(`/profile/`)}
      submitIcon={isRejected ? <RefreshCcw className="h-5 w-5" /> : undefined}
    />
  );
};

export default BankAccountActions;
