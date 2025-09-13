'use client';

import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { FormHeader } from '@/features/profile/presentation/modules/eKyc/shared/components';
import { MessageSquare } from 'lucide-react';

interface ContactInfoHeaderProps {
  status?: EKYCStatus;
}

const ContactInfoHeader: React.FC<ContactInfoHeaderProps> = ({ status }) => {
  return (
    <FormHeader
      icon={MessageSquare}
      title="Contact Information"
      description="Verify your email and phone number for account security"
      iconColor="text-blue-600"
      status={status}
    />
  );
};

export default ContactInfoHeader;
