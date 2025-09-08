'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContactInfoActionsProps {
  isLoading?: boolean;
}

const ContactInfoActions: React.FC<ContactInfoActionsProps> = ({ isLoading = false }) => {
  const router = useRouter();

  return (
    <div className="flex justify-start pt-6">
      <Button
        variant="outline"
        onClick={() => router.push('/profile/')}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Profile
      </Button>
    </div>
  );
};

export default ContactInfoActions;
