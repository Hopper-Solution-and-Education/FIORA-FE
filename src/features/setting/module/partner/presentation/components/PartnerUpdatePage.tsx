'use client';

import { LoadingIndicator } from '@/components/common/atoms/LoadingIndicator';
import FormPage from '@/components/common/forms/FormPage';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import PartnerUpdateForm from '@/features/setting/module/partner/presentation/components/PartnerUpdateForm';
import { fetchPartnerById } from '@/features/setting/module/partner/slices/actions/fetchPartnerByIdAsyncThunk';
import { useAppDispatch } from '@/store';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DeletePartnerButton from './DeletePartnerButton';

export default function PartnerUpdatePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [partner, setPartner] = useState<Partner | null>(null);

  useEffect(() => {
    const getPartner = async () => {
      try {
        setLoading(true);
        const result = await dispatch(fetchPartnerById(id)).unwrap();
        setPartner(result);
      } catch (err) {
        setError(err as string);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getPartner();
    }
  }, [id, dispatch]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error || !partner) {
    router.push('/not-found');
    return null;
  }

  return (
    <FormPage
      title="Update Partner"
      FormComponent={PartnerUpdateForm}
      initialData={partner}
      headerActions={<DeletePartnerButton partnerId={id} partner={partner} partnerName="" />}
    />
  );
}
