'use client';

import FormPage from '@/components/common/forms/FormPage';
import PartnerCreateForm from '@/features/setting/module/partner/presentation/components/PartnerCreateForm';

export default function PartnerCreatePage() {
  return <FormPage title="Create New Partner" FormComponent={PartnerCreateForm} />;
}
