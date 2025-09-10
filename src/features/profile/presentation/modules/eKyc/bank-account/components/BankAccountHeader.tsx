'use client';

import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { FormHeader } from '@/features/profile/presentation/modules/eKyc/shared/components';
import { Building2 } from 'lucide-react';

const BankAccountHeader = ({ status }: { status?: EKYCStatus }) => {
  return (
    <FormHeader
      icon={Building2}
      title="Bank Account Information"
      description="Add your bank account details for secure transactions"
      iconColor="text-blue-600"
      status={status}
    />
  );
};

export default BankAccountHeader;
