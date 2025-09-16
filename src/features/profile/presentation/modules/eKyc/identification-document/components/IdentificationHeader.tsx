'use client';

import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { FormHeader } from '@/features/profile/presentation/modules/eKyc/shared/components';
import { User } from 'lucide-react';

const IdentificationHeader = ({ status }: { status?: EKYCStatus }) => {
  return (
    <FormHeader
      icon={User}
      title="Identity Verification"
      description="Upload your identification documents for account verification"
      iconColor="text-purple-600"
      status={status}
    />
  );
};

export default IdentificationHeader;
