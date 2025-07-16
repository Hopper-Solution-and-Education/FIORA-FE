'use client';

import { FormConfig } from '@/components/common/forms';
import CustomDateTimePicker from '@/components/common/forms/date-time-picker/CustomDateTimePicker';
import InputField from '@/components/common/forms/input/InputField';
import SelectField from '@/components/common/forms/select/SelectField';
import TextareaField from '@/components/common/forms/text-area/TextareaField';
import UploadField from '@/components/common/forms/upload/UploadField';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import {
  UpdatePartnerFormValues,
  updatePartnerSchema,
} from '@/features/setting/module/partner/presentation/schema/updatePartner.schema';
import { fetchPartners } from '@/features/setting/module/partner/slices/actions/fetchPartnersAsyncThunk';
import { updatePartner } from '@/features/setting/module/partner/slices/actions/updatePartnerAsyncThunk';
import { uploadToFirebase } from '@/shared/lib';
import { setErrorsFromObject } from '@/shared/lib/forms/setErrorsFromObject';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface PartnerUpdateFormProps {
  initialData?: Partner;
}

export default function PartnerUpdateForm({ initialData }: PartnerUpdateFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const partners = useAppSelector((state) => state.partner.partners);
  const { data: session, status } = useSession();
  const [isDataFetched, setIsDataFetched] = useState(false);

  const methods = useForm<UpdatePartnerFormValues>({
    resolver: yupResolver(updatePartnerSchema),
    defaultValues: {
      name: initialData?.name || '',
      logo: initialData?.logo || null,
      identify: initialData?.identify || null,
      dob: initialData?.dob || null,
      taxNo: initialData?.taxNo || null,
      address: initialData?.address || null,
      email: initialData?.email || null,
      phone: initialData?.phone || null,
      description: initialData?.description || null,
      parentId: initialData?.parentId || 'none',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchPartnersData = async () => {
      if (status === 'authenticated' && session?.user?.id && !isDataFetched) {
        try {
          await dispatch(
            fetchPartners({
              page: 1,
              pageSize: 100,
              userId: session?.user?.id || '',
              filters: {},
            }),
          ).unwrap();
          setIsDataFetched(true);
        } catch (error) {
          console.error('Error fetching partners:', error);
          toast.error('Failed to load partners data');
        }
      }
    };

    fetchPartnersData();
  }, [dispatch, status, session, isDataFetched]);

  const hasChildren = partners.some((partner: any) => partner.parentId === initialData?.id);

  const parentOptions = [
    { value: 'none', label: 'None' },
    ...partners
      .filter((p) => {
        if (p.id === initialData?.id) return false;

        if (p.parentId !== null) return false;

        return true;
      })
      .map((partner: Partner) => ({
        value: partner.id,
        label: partner.name,
      })),
  ];

  const fields = [
    <UploadField
      key="logo"
      label="Logo"
      name="logo"
      initialImageUrl={initialData?.logo || null}
      previewShape="circle"
    />,
    <InputField key="name" name="name" label="Name" placeholder="Nguyen Van A" />,
    <SelectField
      key="parentId"
      name="parentId"
      label="Parent"
      options={parentOptions}
      placeholder="E.g., FIORA"
      defaultValue={initialData?.parentId || 'none'}
      disabled={hasChildren}
      helperText={
        hasChildren ? 'Cannot change parent because this partner has children' : undefined
      }
    />,
    <TextareaField
      key="description"
      name="description"
      label="Description"
      placeholder="E.g., Leading provider of technology solutions"
    />,
    <CustomDateTimePicker
      key="dob"
      name="dob"
      label="Date of Birth"
      placeholder="15/05/1990"
      showYearDropdown
      showMonthDropdown
      dropdownMode="select"
      dateFormat="dd/MM/yyyy"
    />,
    <InputField key="identify" name="identify" label="Identification" placeholder="123456789012" />,
    <InputField key="taxNo" name="taxNo" label="Tax Number" placeholder="0101234567" />,
    <InputField key="phone" name="phone" label="Phone" placeholder="0123456789" />,
    <InputField
      key="address"
      name="address"
      label="Address"
      placeholder="123 Le Loi Street, District 1, Ho Chi Minh City"
    />,
    <InputField
      key="email"
      name="email"
      label="Email"
      placeholder="contact@fiora.com"
      type="email"
    />,
  ];

  const handleSubmit = async (data: UpdatePartnerFormValues) => {
    try {
      let finalLogoUrl = data.logo;

      if (data.logo && typeof data.logo === 'object' && 'type' in data.logo) {
        finalLogoUrl = await uploadToFirebase({
          file: data.logo as File,
          path: 'partners/logos',
          fileName: `partner_logo_${initialData?.id}_${Date.now()}`,
        });
      }

      const updateData = {
        id: initialData?.id,
        name: data.name !== undefined ? data.name : initialData?.name,
        logo: finalLogoUrl !== undefined ? finalLogoUrl : initialData?.logo,
        identify: data.identify !== undefined ? data.identify : initialData?.identify,
        dob: data.dob !== undefined ? data.dob : initialData?.dob,
        taxNo: data.taxNo !== undefined ? data.taxNo : initialData?.taxNo,
        address: data.address !== undefined ? data.address : initialData?.address,
        email: data.email !== undefined ? data.email : initialData?.email,
        phone: data.phone !== undefined ? data.phone : initialData?.phone,
        description: data.description !== undefined ? data.description : initialData?.description,
        parentId: data.parentId === 'none' ? null : data.parentId || initialData?.parentId,
      };

      await dispatch(updatePartner(updateData)).unwrap();
      router.push('/setting/partner');
    } catch (error: any) {
      if (error.message) {
        setErrorsFromObject(error.message, methods.setError);
      } else {
        toast.error('Failed to update partner');
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        data-test="partner-update-form"
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        <FormConfig
          methods={methods}
          fields={fields}
          onBack={() => router.push('/setting/partner')}
        />
      </form>
    </FormProvider>
  );
}
