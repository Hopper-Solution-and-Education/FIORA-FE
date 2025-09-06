'use client';

import { FormHeader } from '@/features/profile/shared/components';
import { Calculator } from 'lucide-react';

const TaxInfoHeader = () => {
  return (
    <FormHeader
      icon={Calculator}
      title="Tax Information"
      description="Provide your tax details for compliance and reporting purposes"
      iconColor="text-orange-600"
    />
  );
};

export default TaxInfoHeader;
