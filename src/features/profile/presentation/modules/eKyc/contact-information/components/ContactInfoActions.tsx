'use client';

import DefaultSubmitButton from '@/components/common/molecules/DefaultSubmitButton';
import { useRouter } from 'next/navigation';

interface ContactInfoActionsProps {
  isLoading?: boolean;
}

const ContactInfoActions: React.FC<ContactInfoActionsProps> = ({ isLoading = false }) => {
  const router = useRouter();

  return (
    <DefaultSubmitButton
      isSubmitting={isLoading}
      disabled={isLoading}
      onBack={() => router.push(`/profile/`)}
      backTooltip="Back to Profile"
    />
  );
};

export default ContactInfoActions;
