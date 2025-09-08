'use client';

import { FormHeader } from '@/features/profile/presentation/modules/eKyc/shared/components';
import { Building2 } from 'lucide-react';

const BankAccountHeader = () => {
  return (
    <FormHeader
      icon={Building2}
      title="Bank Account Information"
      description="Add your bank account details for secure transactions"
      iconColor="text-blue-600"
    />
  );
};

export default BankAccountHeader;
