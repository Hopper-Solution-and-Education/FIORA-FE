'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface IdentificationActionsProps {
  isLoading: boolean;
  onSubmit?: () => void;
  isRejected?: boolean;
}

const IdentificationActions: React.FC<IdentificationActionsProps> = ({
  isLoading,
  onSubmit,
  isRejected = false,
}) => {
  const router = useRouter();

  return (
    <DefaultSubmitButton
      isSubmitting={isLoading}
      disabled={isLoading}
      onSubmit={onSubmit}
      onBack={() => router.push(`/profile/`)}
      submitTooltip={isRejected ? 'Re-submit KYC' : 'Save & Continue'}
      backTooltip="Back to Profile"
      submitIcon={isRejected ? <RefreshCcw className="h-5 w-5" /> : undefined}
    />
  );
};

export default IdentificationActions;
