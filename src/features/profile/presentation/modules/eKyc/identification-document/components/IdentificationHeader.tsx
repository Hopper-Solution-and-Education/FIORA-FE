'use client';

import { FormHeader } from '@/features/profile/shared/components';
import { User } from 'lucide-react';

const IdentificationHeader = () => {
  return (
    <FormHeader
      icon={User}
      title="Identity Verification"
      description="Upload your identification documents for account verification"
      iconColor="text-purple-600"
    />
  );
};

export default IdentificationHeader;
