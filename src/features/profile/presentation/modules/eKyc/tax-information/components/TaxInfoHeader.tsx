'use client';

import { EKYCStatus } from '@/features/profile/domain/entities/models/profile';
import { FormHeader } from '@/features/profile/presentation/modules/eKyc/shared/components';
import { Calculator } from 'lucide-react';

const TaxInfoHeader = ({ status }: { status?: EKYCStatus }) => {
  return (
    <FormHeader
      icon={Calculator}
      title="Tax Information"
      description="Provide your tax details for compliance and reporting purposes"
      iconColor="text-orange-600"
      status={status}
    />
  );
};

export default TaxInfoHeader;
