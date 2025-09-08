'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { useRouter } from 'next/navigation';

interface TaxActionsProps {
  onSubmit: () => void;
  isLoading?: boolean;
}

const TaxActions: React.FC<TaxActionsProps> = ({ onSubmit, isLoading = false }) => {
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

export default TaxActions;
