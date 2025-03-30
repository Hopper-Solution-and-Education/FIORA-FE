// src/features/setting/module/partner/presentation/components/PartnerUpdateForm.tsx
'use client';

import InputField from '@/components/common/atoms/InputField';
import SelectField from '@/components/common/atoms/SelectField';
import TextareaField from '@/components/common/atoms/TextareaField';
import UploadField from '@/components/common/atoms/UploadField';
import GlobalForm from '@/components/common/organisms/GlobalForm';
import { Button } from '@/components/ui/button';
import { Partner } from '@/features/setting/module/partner/domain/entities/Partner';
import {
  UpdatePartnerFormValues,
  updatePartnerSchema,
} from '@/features/setting/module/partner/presentation/schema/updatePartner.schema';
import { updatePartner } from '@/features/setting/module/partner/slices/actions/updatePartnerAsyncThunk';
import { useAppDispatch, useAppSelector } from '@/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PartnerUpdateFormProps {
  initialData?: Partner;
}

export default function PartnerUpdateForm({ initialData }: PartnerUpdateFormProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const partners = useAppSelector((state) => state.partner.partners);

  const parentOptions = [
    { value: 'none', label: 'None' },
    ...partners
      .filter((p) => p.id !== initialData?.id)
      .map((partner) => ({
        value: partner.id,
        label: partner.name,
      })),
  ];

  // Đặt giá trị mặc định cho form dựa trên initialData
  const defaultValues: Partial<UpdatePartnerFormValues> = {
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
  };

  const fields = [
    <SelectField
      key="parentId"
      name="parentId"
      label="Parent"
      options={parentOptions}
      placeholder="Select a parent partner"
    />,
    <InputField key="name" name="name" label="Name" placeholder="Partner Name" required />,
    <TextareaField
      key="description"
      name="description"
      label="Description"
      placeholder="Enter description"
    />,
    <InputField
      key="dob"
      name="dob"
      label="Date of Birth"
      type="date"
      placeholder="Select date of birth"
    />,
    <UploadField key="logo" label="Logo" name="logo" />,
    <InputField key="taxNo" name="taxNo" label="Tax Number" placeholder="Tax Number" />,
    <InputField key="phone" name="phone" label="Phone" placeholder="Phone Number" />,
    <InputField key="address" name="address" label="Address" placeholder="Address" />,
    <InputField key="email" name="email" label="Email" placeholder="Email" type="email" />,
  ];

  // Xử lý submit form
  const onSubmit = async (data: UpdatePartnerFormValues) => {
    const updateData = {
      id: initialData?.id,
      name: data.name || undefined,
      logo: data.logo || '',
      identify: data.identify || undefined,
      dob: data.dob || undefined,
      taxNo: data.taxNo || undefined,
      address: data.address || undefined,
      email: data.email || undefined,
      phone: data.phone || undefined,
      description: data.description || undefined,
      parentId: data.parentId === 'none' ? undefined : data.parentId,
    };

    try {
      await dispatch(updatePartner(updateData)).unwrap();
      toast.success('Partner updated successfully');
      router.push('/setting/partner');
    } catch (error) {
      toast.error('Failed to update partner');
      console.error(error);
    }
  };

  return (
    <GlobalForm
      fields={fields}
      schema={updatePartnerSchema}
      onSubmit={onSubmit}
      defaultValues={defaultValues}
      renderSubmitButton={(formState) => (
        <Button type="submit" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? 'Updating...' : 'Update Partner'}
        </Button>
      )}
    />
  );
}
