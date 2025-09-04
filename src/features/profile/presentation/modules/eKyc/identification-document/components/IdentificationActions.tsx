'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { useRouter } from 'next/navigation';

interface IdentificationActionsProps {
  isLoading: boolean;
  onSubmit: () => void;
}

const IdentificationActions: React.FC<IdentificationActionsProps> = ({ isLoading, onSubmit }) => {
  const router = useRouter();

  return (
    <DefaultSubmitButton
      isSubmitting={isLoading}
      disabled={isLoading}
      onSubmit={onSubmit}
      onBack={() => router.push(`/profile/`)}
      submitTooltip="Save & Continue"
      backTooltip="Back to Profile"
    />
  );
};

export default IdentificationActions;
