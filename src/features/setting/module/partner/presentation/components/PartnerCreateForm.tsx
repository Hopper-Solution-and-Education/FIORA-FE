'use client';

import { FormConfig } from '@/components/common/forms';
import CustomDateTimePicker from '@/components/common/forms/date-time-picker/CustomDateTimePicker';
import InputField from '@/components/common/forms/input/InputField';
import SelectField from '@/components/common/forms/select/SelectField';
import TextareaField from '@/components/common/forms/text-area/TextareaField';
import UploadField from '@/components/common/forms/upload/UploadField';
import { useCreatePartner } from '@/features/setting/hooks/useCreatePartner';
import {
  PartnerFormValues,
  partnerSchema,
} from '@/features/setting/module/partner/presentation/schema/addPartner.schema';
import { fetchPartners } from '@/features/setting/module/partner/slices/actions/fetchPartnersAsyncThunk';
import { useAppDispatch, useAppSelector } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function PartnerCreateForm() {
  const { onSubmit: submitPartner } = useCreatePartner({
    redirectPath: '/setting/partner',
  });

  const dispatch = useAppDispatch();
  const partners = useAppSelector((state) => state.partner.partners);
  const { data: session, status } = useSession();
  const [isDataFetched, setIsDataFetched] = useState(false);

  const methods = useForm<PartnerFormValues>({
    resolver: yupResolver(partnerSchema),
    defaultValues: {
      parentId: 'none',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchPartnersData = async () => {
      if (status === 'authenticated' && session?.user?.id && !isDataFetched) {
        try {
          await dispatch(
            fetchPartners({ userId: session.user.id, page: 1, pageSize: 100 }),
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

  const parentOptions = [
    { value: 'none', label: 'None' },
    ...partners
      .filter((partner) => partner.parentId === null)
      .map((partner) => ({
        value: partner.id,
        label: partner.name,
      })),
  ];

  const fields = [
    <SelectField
      key="parentId"
      name="parentId"
      label="Parent"
      options={parentOptions}
      placeholder="FIORA"
      defaultValue="none"
    />,
    <InputField key="name" name="name" label="Name" placeholder="Nguyen Van A" required />,
    <UploadField key="logo" label="Logo" name="logo" previewShape="circle" />,
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

  const handleSubmit = async (data: PartnerFormValues) => {
    await submitPartner(data, methods.setError);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
        <FormConfig methods={methods} fields={fields} onBack={() => window.history.back()} />
      </form>
    </FormProvider>
  );
}
