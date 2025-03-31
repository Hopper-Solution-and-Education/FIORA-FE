// src/features/setting/module/partner/presentation/components/PartnerUpdatePage.tsx
'use client';

import { useParams } from 'next/navigation';
import { useAppSelector } from '@/store';
import FormPage from '@/components/common/organisms/FormPage';
import PartnerUpdateForm from '@/features/setting/module/partner/presentation/components/PartnerUpdateForm';
import { notFound } from 'next/navigation';

export default function PartnerUpdatePage() {
  const params = useParams();
  const id = params?.id as string;
  const partner = useAppSelector((state) => state.partner.partners.find((p) => p.id === id));

  if (!partner) {
    notFound();
  }

  return (
    <FormPage title="Update Partner" FormComponent={PartnerUpdateForm} initialData={partner} />
  );
}
